exports.registerEmail=(user,verificationURL)=>
`<h2>Welcome</h2>
    <p>Please verify your email</p>
    <a href="${verificationURL}">Verify</a>
    <p>${verificationURL}</p>
`
exports.resetPasswordEmail=(user,verificationURL)=>
`<h2>Hi</h2>
    <p>To Forgot Your Password Click On Below Link.</p>
    <a href="${verificationURL}">Verify</a>
    <p>${verificationURL}</p>
`