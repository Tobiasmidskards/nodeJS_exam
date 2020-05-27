function validate(event) {
       
    let username = $('#username').val();
    let password = $('#password').val();
    let passwordc = $('#password-confirm').val();

    $.ajax({
            method: "POST",
            url: "/signup",
            data: { 
                    username: username, 
                    password: password,
                    passwordRepeat: passwordc
                }
            }
        ).done((response) => {
            alert('Account created, login to login')
            window.location.assign('/login');
        })
        .fail((response) => {
        });
}