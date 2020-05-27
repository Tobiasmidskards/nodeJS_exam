let message = $('#message');
let recipes = []
let currentRecipe = undefined

$.ajax({
    method: "GET",
    url: "/recipes/unapproved",
    }
).done((response) => {
    recipes = response.recipes;

    console.log(response)

    if(recipes.length > 0) {
        message.hide();
    } else {
        message.find("h4").text("No waiting recipies")
    }

    let tbody = $('#recipes');

    recipes.forEach(recipe => {
        let row = $('<tr></tr>');
        row.append(`<input hidden value="${recipe.id}">`)
        row.append(`<td>${recipe.name}</td>`);
        row.append(`<td>${recipe.style.name}</td>`);
        row.append(`<td>${recipe.prepTime} min.</td>`);
    
        row.appendTo(tbody)
    });

    let rows = $('#recipes tr');

    rows.each(function(index) {
        $(this).on('click', () => {
            showModal($(this).find('input').val())
        })
    })
})
.fail((error) => {
    message.find("h4").text("An error accoured")
});

function showModal(id) {
    $('#recipeModal').modal('show');

    let modalName = $('#modalName')
    let modalStyle = $('#modalStyle')
    let modalDesc = $('#modalDesc')
    let modalLink = $('#modalLink')
    
    currentRecipe = recipes.find(recipe => recipe.id === Number(id))

    modalName.text(currentRecipe.name);
    modalStyle.text(currentRecipe.style.name);
    modalDesc.text(currentRecipe.description);
    modalLink.attr('href', currentRecipe.link);
}

function approve() {
    $.ajax({
        method: "POST",
        url: "/recipes/approve",
        data: {
            id: currentRecipe.id
        }
        }
    ).done((response) => {
        if (response.response === "OK") {
            alert("Recipe has been approved");
            location.reload();
        }
    })
}