let message = $('#message');
let recipes = []
let currentRecipe = undefined

function showModal(id) {
    $('#recipeModal').modal('show');

    let modalName = $('#modalName')
    let modalStyle = $('#modalStyle')
    let modalDesc = $('#modalDesc')
    let modalLink = $('#modalLink')
    let modalLikes = $('#modalLikes')
    let modalPrepTime = $('#modalPrepTime')
    
    currentRecipe = recipes.find(recipe => recipe.id === Number(id))

    modalName.text(currentRecipe.name);
    modalStyle.text(currentRecipe.style.name);
    modalDesc.text(currentRecipe.description);
    modalLikes.text(currentRecipe.likes + ' likes');
    modalPrepTime.text(currentRecipe.prepTime + ' mins.');
    modalLink.attr('href', currentRecipe.link);
}

$.ajax({
    method: "GET",
    url: "/user/recipes",
    }
).done((response) => {
    recipes = response.response.recipe;

    if(recipes.length > 0) {
        message.hide();
    } else {
        message.find("h4").text("You have no recipes")
    }

    let tbody = $('#recipes');

    recipes.forEach(recipe => {
        let row = $('<tr></tr>');
        row.append(`<input hidden value="${recipe.id}">`)
        row.append(`<td>${recipe.name}</td>`);
        row.append(`<td>${recipe.style.name}</td>`);
        row.append(`<td>${recipe.prepTime} min.</td>`);
        
        let approved = $('<td></td>');

        if (recipe.approved) {
            approved.text("Yes");
            approved.css('color', 'green');
        } else {
            approved.text("No");
            approved.css('color', 'red');
        }

        row.append(approved);
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

function deleteRecipe() {
    $.ajax('/recipes/delete/' + currentRecipe.id)
        .done((response) => {
            if (response.response === "OK") {
                alert('Recipe deleted!');
                location.reload();
            }
        })
}

function editRecipe() {
    location.href = '/recipe/edit/' + currentRecipe.id;
}