$('#prepTime').on('change', () => {
    let inHoursEl = $('#inHours');
    let timeInMinutes = $('#prepTime').val();

    let timeInHours = (timeInMinutes / 60).toFixed(2);
    
    if (timeInMinutes > 0) {
        inHoursEl.text(`Minimum prep. time is ${timeInHours} hours`);
        inHoursEl.show();
    } else {
        inHoursEl.hide();
    }
})

let recipeId = location.href.split('/').pop();

$.ajax({
        method: "GET",
        url: "/recipes/get/" + recipeId
        }
    ).done((response) => {
        let recipe = response.recipe;
        $('#styles').val(recipe.styleId);
        $('#name').val(recipe.name);
        $('#prepTime').val(recipe.prepTime);
        $('#description').val(recipe.description);
        $('#link').val(recipe.link);
    })
    .catch((response) => {
        alert(response.responseJSON.response);
        location.href = '/dashboard';
    })

$.ajax({
        method: "GET",
        url: "/styles"
        }
    ).done((response) => {
        let styles = response.styles;
        let select = $('#styles');
        styles.forEach(style => {
            select.append(`<option value="${style.id}">${style.name}</option>`)
        });
    })

function validate(event) {
    event.preventDefault();
    let error = $('#error-message');
    error.text("")

    let styleId = $('#styles').val();
    let name = $('#name').val();
    let prepTime = $('#prepTime').val();
    let description = $('#description').val();
    let link = $('#link').val();

    if (styleId === undefined) {
        error.text("Please select a style");
    }

    if (name.length < 3) {
        error.text("Please provide a longer name");
    }

    if (prepTime < 15) {
        error.text("Minimum preperationtime should be over 15 minutes");
    }

    if (description.length < 15) {
        error.text("Please fill in a proper description");
    }

    if (description.length > 255) {
        error.text("Description is too long");
    }

    if (link.length < 5) {
        error.text("Please provide a link");
    }

    if (error.text() !== '' ) {
        error.show();
        return;
    } else {
        error.hide();
    }

    let accept = confirm("If you update your recipe, an admin should approve it again");

    if (accept) {
    $.ajax({
        method: "POST",
        url: "/recipes/update",
        data: { 
                recipeId,
                styleId,
                name,
                description,
                prepTime,
                link
            }
        }
    ).done((response) => {
        if (response.response === "OK") {
            alert("Your recipe has been updated!")
            location.href = "/dashboard";
        }
    })
    .fail((response) => {
        error.text(response.statusText)
        error.show();
    });
}

}