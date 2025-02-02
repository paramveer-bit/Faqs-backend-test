import asyncHandler from '../helper/asyncHandler';
import ApiError from '../helper/ApiError';
import SendMail from '../helper/sendmail';
import { Request, Response } from 'express';
import Faq from '../models/faq';
import User from '../models/user';
import Translate from 'translate-google';

const transltor = async (text: string, lang: string) => {
    try {
        const translatedText = await Translate(text, { to: lang });
        return translatedText
    } catch (error) {
        return text
    }
}


const addFaq = asyncHandler(async (req: Request, res: Response) => {
    const { question, answer } = req.body

    const user = req.user

    if (!question || !answer) {
        throw new ApiError(400, "Question and Answer is required")
    }

    const faq = new Faq({
        question: question,
        answer: answer,
        owner: user._id
    })
    await faq.save()

    res.status(200).json({ success: true, message: "FAQ added successfully", faq })
})

const deleteFaq = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body

    const user = req.user

    if (!id) {
        throw new ApiError(400, "FAQ id is required")
    }

    const faq = await Faq.findById(id)
    if (faq == null) {
        throw new ApiError(400, "FAQ not found")
    }

    if (faq.owner != null && (faq.owner.toString() !== user._id.toString())) {
        throw new ApiError(401, "Unauthorized Access")
    }

    await Faq.findByIdAndDelete(id)

    res.status(200).json({ success: true, message: "FAQ deleted successfully" })
})

const getFaq = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body
    if (!email) {
        throw new ApiError(400, "Email is required")
    }
    const user = await User.findOne({ email: email })
    if (user == null) {
        throw new ApiError(400, "User not found")
    }
    const faqs = await Faq.find({ owner: user._id }).populate('owner', 'email')
    res.status(200).json({ success: true, faqs })
})

const getFaqInLanguage = asyncHandler(async (req: Request, res: Response) => {
    const lang = req.query.lang as string || 'en'
    const { email } = req.body
    console.log(lang)
    if (!email) {
        throw new ApiError(400, "Email is required")
    }
    const user = await User.findOne({ email: email })
    if (user == null) {
        throw new ApiError(400, "User not found")
    }

    const faqs = await Faq.find({ owner: user._id }).populate('owner', 'email')


    for (let i = 0; i < faqs.length; i++) {
        faqs[i].question = await transltor(faqs[i].question, lang)
        faqs[i].answer = await transltor(faqs[i].answer, lang)
    }
    console.log(faqs)

    res.status(200).json({ success: true, faqs })
})




export { addFaq, deleteFaq, getFaq, getFaqInLanguage }

