import asyncHandler from '../helper/asyncHandler';
import ApiError from '../helper/ApiError';
import SendMail from '../helper/sendmail';
import { Request, Response } from 'express';
import User from '../models/user';
import jwt from "jsonwebtoken"



const registerUser = asyncHandler(async (req: Request, res: Response) => {
    //get user details also file handeling
    const { email, password } = req.body

    //Validation --not empty
    if (!email || !password) {
        throw new ApiError(400, "Email and Password is required")
    }

    const user = await User.findOne({ email: email })
    if (user != null && user.isVerified) {
        throw new ApiError(400, "User already exist")
    }
    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // save otp and user in database
    const otpExpires = new Date()
    otpExpires.setMinutes(otpExpires.getMinutes() + 10)
    const newUser = new User({
        email: email,
        password: password,
        otp: otp,
        otpExpires: otpExpires
    })
    await newUser.save()


    // send otp to email
    const eamilResponse = await SendMail(email, email, otp)
    if (!eamilResponse.success) {
        throw new ApiError(500, "Error in sending email")
    }


    res.status(200).json({ success: true, message: "User registered successfully" })
})

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP is required")
    }

    const user = await User.findOne({ email: email })
    if (!user) {
        throw new ApiError(400, "User not found")
    }

    if (user.otp !== otp) {
        throw new ApiError(400, "Invalid OTP")
    }

    if (user.otpExpires != null && user.otpExpires < new Date()) {
        throw new ApiError(400, "OTP expired")
    }

    user.isVerified = true
    await user.save()

    res.status(200).json({ success: true, message: "User verified successfully" })
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new ApiError(400, "Email and Password is required")
    }

    const user = await User.findOne({ email: email })
    if (!user) {
        throw new ApiError(400, "User not found")
    }

    if (!user.isVerified) {
        throw new ApiError(400, "User not verified")
    }

    if (user.password !== password) {
        throw new ApiError(400, "Invalid Password")
    }


    // generate a jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })

    // store it in cookies
    res.cookie('token', token, {
        expires: new Date(Date.now() + 86400000),
        secure: false, // set to true if your using https
        httpOnly: true,
        sameSite: 'lax'
    })


    res.status(200).json({ success: true, message: "User logged in successfully" })
})

const resendMail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body
    if (!email) {
        throw new ApiError(400, "Email is required")
    }
    const user = await User.findOne({ email: email })

    if (!user) {
        throw new ApiError(400, "No user found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "User Already verfied")
    }


    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // save otp and user in database
    const otpExpires = new Date()
    otpExpires.setMinutes(otpExpires.getMinutes() + 10)

    user.otp = otp;
    user.otpExpires = otpExpires
    await user.save()

    const eamilResponse = await SendMail(email, email, otp)
    if (!eamilResponse.success) {
        throw new ApiError(500, "Error in sending email")
    }

    res.status(200).json({ success: true, message: "otp send succesfully" })

})

const isLoggedIn = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ success: true, user: req.user })
})

const logout = asyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('token')
    res.status(200).json({ success: true, message: "User logged out successfully" })
})





export { loginUser, registerUser, resendMail, verifyUser, isLoggedIn, logout }
