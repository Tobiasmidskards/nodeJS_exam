let alertDiv = $('#alert');
let errors = [];

function validate(event) {
    event.preventDefault();
    errors = [];
    alertDiv.text("");
    alertDiv.hide();
    
    let username = 'admin';//$('#username').val();
    let password = 'password';//$('#password').val();

    if(username.length < 4) {
        errors.push({
            message: 'Username is too short',
        })
    }

    if(password.length < 4) {
        errors.push({
            message: 'password is too short',
        })
    }

    if (!password.length < 4 && !username.length < 4) {
        $.ajax({
            method: "POST",
            url: "/login",
            data: { 
                    username: username, 
                    password: password 
                }
            }
        ).done((response) => {
            if (response.response === "OK") {
                window.location.assign('/dashboard');
            }
        })
        .fail((response) => {
            errors.push({
                message: response.responseJSON.response
            })

            showAlerts();
        });
    }

    showAlerts();
}

function showAlerts() {
    if (errors.length > 0) {
        errors.forEach(element => {
            let message = $(`<span>${element.message}</span><br />`)
            alertDiv.prepend(message)
        });
        alertDiv.show();

        return false;
    }
    return true;
} 