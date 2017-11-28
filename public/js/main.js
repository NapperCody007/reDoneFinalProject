$(document).ready(function () {
    $('.deletetask').on('click', deleteToDo)
    $('.updatetask').on('click', getToDo)
})

function deleteToDo () {
    var confirmation = confirm('Are You Sure?')

    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/toDo/delete/' + $(this).data('id')
        }).done(function (response) {
            window.location.replace('/')
        })
        window.location.replace('/')
    } else {
        return false;
    }
}

function getToDo () {
    window.location.replace('/toDo/update/' + $(this).data('id'))
}