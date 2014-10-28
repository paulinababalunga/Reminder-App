// Refactor your code, dammit!

Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

console.log(localStorage['app']);
var app = localStorage['app'] ? JSON.parse(localStorage['app']) : //{config:{},data:{}};

    /*var app =*/ {
    config: {
        maxCategoriesPerPage: 3,
        maxRemindersPerCategory: 10,
        editReminder: {
            reminderId: '',
            categoryId: ''
        },
        selectedCategory: ''
    },
    data: {
        0: {
            category: 'Important',
            reminders: {
                0: {
                    description: "Azi nu fac nimic",
                    date: '1412152785124',
                    priorityLevel: 3,
                    isDone: false
                },
                1: {
                    description: "Azi nu fac nimic",
                    date: '19214141241',
                    priorityLevel: 3,
                    isDone: false
                },
                2: {
                    description: "Azi nu fac nimic",
                    date: '1412262000206',
                    priorityLevel: 1,
                    isDone: false
                },
                3: {
                    description: "Azi nu fac nimic",
                    date: '192141412422',
                    priorityLevel: 3,
                    isDone: false
                }
            }
        },
        1: {
            category: 'Not Important',
            reminders: {
                0: {
                    description: "Azi dorm",
                    date: '19214141246',
                    priorityLevel: 3,
                    isDone: false
                },
                1: {
                    description: "Azi  fac mancare",
                    date: '19214141243566',
                    priorityLevel: 3,
                    isDone: false
                },
                2: {
                    description: "Azi citesc",
                    date: '192141412478',
                    priorityLevel: 2,
                    isDone: false
                },
                3: {
                    description: "Azi nu fac nimic",
                    date: '19214141240',
                    priorityLevel: 3,
                    isDone: false
                }
            }
        }
    }
};

console.log(app);
var i = localStorage.length;

$(document).ready(function () {

//clear localStorage
    $("#clear").click(function () {
        localStorage.clear();
        $("#todo_list li").fadeOut(function () {
            $(this).html("");
        });
    });


//    for (var category in app.data) {
//        $('<li></li><a>').val(category).text(app.data[category].category).appendTo('.category');
//    }

//add category
    for (var category in app.data) {
        $('<li>').text(app.data[category].category)
            .attr('data-category', category)
            .attr('data-title', app.data[category].category)
            .appendTo('.nav-tag');
    }


//Save
    $('#btn-submit-reminder').click(function () {
        save_todo();
        location.reload();
    });


//    $("#category").change(function () {
//        addReminders($(this).val());
//    });

    // addReminders($("#category").val());

    clock();

    //event handler for category button
    $(".my-navbar .nav-div ul li").click(function () {
        var categoryId = $(this).data('category');
        var categoryTitle = $(this).data('title');
        $(".span_title").text(categoryTitle);
        addReminders(categoryId);
        app.config.selectedCategory = categoryId;
    });


    addReminders(app.config.selectedCategory);


});

function addReminders(category) {
    console.log(category);
    $("#todo_list").html('');

    for (var reminder in app.data[category].reminders) {
        $("#todo_list").append(
                '<li class="row li-row" id="reminder-' + reminder + '" data-reminder-id="' + reminder + '" data-category-id="' + category + '"' + /*(app.data[category].reminders[reminder].isDone ? 'style="display:none"' : '')*/ '' + '>' +
                '<input type="checkbox" class="checkboxInput" ' + (app.data[category].reminders[reminder].isDone ? 'checked' : '') + '>' +
                '<a href="#"  >' + app.data[category].reminders[reminder].description + ' - ' + new Date(app.data[category].reminders[reminder].date).toLocaleString() + '</a>' +
                '<a href="#"  class="remove">Remove</a>' +
                '<a href="#" class="modify" data-toggle="modal" data-target="#addReminderModal">Edit</a>' +
                '</li>');
    }


//    if(app.data[category].reminders[reminder].priorityLevel === 1){
//     //console.log("1" + app.data[category].reminders[reminder].priorityLevel);
//     $("#todo_list li").css('background-color','green');
//     }
//     else if(app.data[category].reminders[reminder].priorityLevel === 2){
//     console.log("2"+app.data[category].reminders[reminder].priorityLevel);
//     $("#todo_list li").css('background-color','yellow');
//
//     }else{
//     //console.log("3"+ app.data[category].reminders[reminder].priorityLevel);
//     $("#todo_list li").css({'background-color':'red'});
//     }

//add new reminder
    $("#add").click(function () {
        $(".modal-header h3").text("Add new reminder");
        app.config.editReminder = {
            reminderId: '',
            categoryId: app.config.selectedCategory
        };
    });


//Edit a reminder
    $(".modify").click(function () {
        $(".modal-header h3").text("Edit Reminder");
        app.config.editReminder = {
            reminderId: $(this).parent().data('reminderId'),
            categoryId: $(this).parent().data('categoryId')
        };
        $("#textInput").val(app.data[app.config.editReminder.categoryId].reminders[app.config.editReminder.reminderId].description);
        $("#dateInput").val(app.data[app.config.editReminder.categoryId].reminders[app.config.editReminder.reminderId].date);
        $("form input[type=radio]:checked").val(app.data[app.config.editReminder.categoryId].reminders[app.config.editReminder.reminderId].priorityLevel);

        // $("#priorityInput").val(app.data[app.config.editReminder.categoryId].reminders[app.config.editReminder.reminderId].priorityLevel);
    });

//check a reminder and hide it
    $("#todo_list li input[type=checkbox]").click(function () {
        if ($(this).is(':checked')) {
            var reminderNo = $(this).parent().data('reminderId');
            var categoryNo = $(this).parent().data('categoryId');
            //$(this).parent().css({opacity: 0.5});
            app.data[categoryNo].reminders[reminderNo].isDone = true;
            $(this).parent().addClass('setOpacity');
            localStorage['app'] = JSON.stringify(app);

        } else {
            var reminderNo = $(this).parent().data('reminderId');
            var categoryNo = $(this).parent().data('categoryId');
            app.data[categoryNo].reminders[reminderNo].isDone = false;
            //  $(this).parent().css({opacity:1});
            $(this).parent().addClass('notOpacity');
            localStorage['app'] = JSON.stringify(app);
        }
    });


//view all list reminders
//    $(".listBtn").click(function () {
//       $("#todo_list li").show();
//
////        $("#todo_list li input[type=checkbox]").click(function () {
////            if($(this).is(':checked')){
////            var reminderNo = $(this).parent().data('reminderId');
////            var categoryNo = $(this).parent().data('categoryId');
////            app.data[categoryNo].reminders[reminderNo].isDone = true;
////            console.log(app.data[categoryNo].reminders[reminderNo].isDone);
////                $(this).parent().css({opacity:1});
////            localStorage['app'] = JSON.stringify(app);
////            }else{
////                var reminderNo = $(this).parent().data('reminderId');
////                var categoryNo = $(this).parent().data('categoryId');
////                app.data[categoryNo].reminders[reminderNo].isDone = false;
////                $(this).parent().css({opacity:1});
////                localStorage['app'] = JSON.stringify(app);
////            }
////
////        });
//
//    });


    //delete reminder from list
    $('#todo_list').on('click', '.remove', function () {
        var reminderNo = $(this).parent().data('reminderId');
        var categoryNo = $(this).parent().data('categoryId');
        delete app.data[categoryNo].reminders[reminderNo];
        $(this).parent().remove();
        localStorage['app'] = JSON.stringify(app);
    });
}


// Function which saves the data from the modal
function save_todo() {

    var reminder = {
        description: $("#textInput").val(),
        date: dateSanitizer($('#dateInput').val()),
        // priorityLevel: $("#priorityInput").val(),
        priorityLevel: $("form input[type='radio']:checked").val(),
        isDone: false
    };

    var categoryId = app.config.editReminder.categoryId;
    var reminderId = app.config.editReminder.reminderId;

    if (reminderId) { // Modify a reminder
        app.data[categoryId].reminders[reminderId] = reminder;
    } else { // Add it
        app.data[categoryId].reminders[Object.keys(app.data[categoryId].reminders)] = reminder;

    }

    localStorage['app'] = JSON.stringify(app); //save app to localStorage
    $("#addReminderModal").modal('hide');

}

// Time zone
function dateSanitizer(date) {
    if (typeof(date) === 'string') {
        date = new Date(date);
    }
    var userOffset = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() + userOffset).getTime();

}

function clock() {
    var date = new Date();
    var timeDate = date.getTime();
    for (var x in app.data) {
        for (var y in app.data[x].reminders) {
            var timeCalculation = Number(app.data[x].reminders[y].date) - Number(timeDate);
            if (timeCalculation <= 1000 * 60 * 15 && timeCalculation >= 0) {
                setTimeout(1000 * 60 * 3);
                $("#notify").show();
                $("h6").text(app.data[x].reminders[y].description + " " + new Date(app.data[x].reminders[y].date).toLocaleString());
            }

        }
    }
}