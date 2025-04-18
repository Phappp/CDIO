if (newPassword.length < 6) {
    return res.render('staff/changePassword', {
        error: 'Mật khẩu mới phải có ít nhất 6 ký tự',
        success: null
    });
}