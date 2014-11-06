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
    selectedCategory: undefined
  },
  data: {
    0: {
      category: 'Important',
      reminders: {
        0: {
          description: "Azi nu fac nimic",
          date: 1412152785124,
          priorityLevel: 3,
          isDone: false
        },
        1: {
          description: "Azi nu fac nimic",
          date: 19214141241,
          priorityLevel: 3,
          isDone: false
        },
        2: {
          description: "Azi nu fac nimic",
          date: 1412262000206,
          priorityLevel: 1,
          isDone: false
        },
        3: {
          description: "Azi nu fac nimic",
          date: 192141412422,
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
          date: 19214141246,
          priorityLevel: 3,
          isDone: false
        },
        1: {
          description: "Azi  fac mancare",
          date: 19214141243566,
          priorityLevel: 3,
          isDone: false
        },
        2: {
          description: "Azi citesc",
          date: 192141412478,
          priorityLevel: 2,
          isDone: false
        },
        3: {
          description: "Azi nu fac nimic",
          date: 19214141240,
          priorityLevel: 3,
          isDone: false
        }
      }
    }
  }
};

var i = localStorage.length;

$(document).ready(function () {
  init();
});

var initEventHandlers = function () {
  //Add a new style class when used mobile
  $(".btn-navbar").click(function () {
    $("#todo_list").toggleClass("newStyle");
  });


  //Add new reminder
  $("#add").click(function () {
    $(".modal-header h3").text("Add new reminder");
    app.config.editReminder = {
      reminderId: '',
      categoryId: app.config.selectedCategory
    };
  });

  //Delete reminder from list
  $('#todo_list').on('click', '.removeReminder', function () {
    var reminderNo = $(this).parent().data('reminderId');
    var categoryNo = $(this).parent().data('categoryId');
    delete app.data[categoryNo].reminders[reminderNo];
    $(this).parent().remove();
    localStorage['app'] = JSON.stringify(app);
  });

  //Click on category button and change title



  //Save new reminder in list
  $('#btn-submit-reminder').click(function () {
    save_todo();
    location.reload();

  });


  //Save new category in list
  $('#btn-submit-category').click(function () {
    saveNewCategory();
    location.reload();
  });


  //Disable add button when category is not selected
  $('#add').click(function(){
    if (app.config.selectedCategory == undefined) {
      $('#add').prop('disabled', true);
    } else {
      $('#add').prop('disabled', false);
    }
  });
  
}

//Init function
var init = function () {

  addReminders(app.config.selectedCategory);
  addCategories();
  clock();
  initEventHandlers();


};

//Add new reminder
function addReminders(category) {
  if (category != undefined) {
    $("#todo_list").html('');
    for (var reminder in app.data[category].reminders) {
      $("#todo_list").append(
        '<li class="row li-row" id="reminder-' + reminder + '" data-reminder-id="' + reminder + '" data-category-id="' + category + '"' + /*(app.data[category].reminders[reminder].isDone ? 'style="display:none"' : '')*/ '' + '>' +
        '<input type="checkbox" class="checkboxInput" ' + (app.data[category].reminders[reminder].isDone ? 'checked' : '') + '>' +
        '<a href="#"  >' + app.data[category].reminders[reminder].description + ' - ' + new Date(app.data[category].reminders[reminder].date).toLocaleString() + '</a>' +
          //'<a href="#"  class="remove">Remove</a>' +
        '<span class="glyphicon glyphicon-remove removeReminder"></span>' +
        '<span class="glyphicon glyphicon-pencil modifyReminder" data-toggle="modal" data-target="#addReminderModal"></span>' +
        '</li>');
      localStorage['app'] = JSON.stringify(app);
    }
  }


  //Edit a reminder
  $(".modifyReminder").click(function () {
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


  //check and uncheck a reminder and hide it
  $("#todo_list li input[type=checkbox]").click(function () {
    var reminderNo = $(this).parent().data('reminderId');
    var categoryNo = $(this).parent().data('categoryId');

    if ($(this).is(':checked')) {
    //$(this).parent().css({opacity: 0.5});
    app.data[categoryNo].reminders[reminderNo].isDone = true;
      //$(this).parent().addClass('setOpacity');
    localStorage['app'] = JSON.stringify(app);

    } else {
        app.data[categoryNo].reminders[reminderNo].isDone = false;
        //  $(this).parent().css({opacity:1});
        //$(this).parent().addClass('notOpacity');
        localStorage['app'] = JSON.stringify(app);
    }
  });
}

// Add new category
function addCategories() {
  //clear UI
  $('.nav-tag').html();
  //add category
  for (var category in app.data) {
    $('.nav-tag').append(
      '<li data-category="' + category + '" data-title="' + app.data[category].category + '"' + '>' + '<span class="liStyle">' + app.data[category].category + '</span>' + '<span class="glyphicon glyphicon-remove removeCategory"></span>' +
      '<span class="glyphicon glyphicon-pencil modifyCategory" data-toggle="modal" data-target="#addNewCategory"></span>' +
      '</li>');
    localStorage['app'] = JSON.stringify(app);
  }

  //Click on addButton category
  $(".btnAddCategory").click(function () {
    $(".modal-header h3").text("Add new category");
    app.config.editReminder = {
      categoryId: ''
    };

  });

  // Click on list of categories and view reminders
  $(".my-navbar .nav-div ul li").click(function () {
    var categoryId = $(this).data('category');
    var categoryTitle = $(this).data('title');
    $(".span_title").text(categoryTitle);
    addReminders(categoryId);
    app.config.selectedCategory = categoryId;
    //localStorage['app'] = JSON.stringify(app);
  });


  //Delete category from list
  $('.removeCategory').click(function () {
    //var reminderNo = $(this).parent().data('reminderId');
    var categoryNo = $(this).parent().data('category');
    delete app.data[categoryNo];
    $(this).parent().remove();
    //app.config.selectedCategory = categoryNo;
    localStorage['app'] = JSON.stringify(app);
  });

  //Modify category
  $(".modifyCategory").click(function () {
    $(".modal-header h3").text("Edit Category");
    //$('.nav-tag').html();
    app.config.editReminder = {
      //  //reminderId: $(this).parent().data('reminderId'),
      categoryId: $(this).parent().data('category')
    };
    $("#textInputCategory").val(app.data[app.config.editReminder.categoryId].category);
  });
}

//Function which saves new category
function saveNewCategory() {
  var category = {
    category: $("#textInputCategory").val(),
    reminders: {}
  };
  var categoryId = app.config.editReminder.categoryId;
  //var reminderId = app.config.editReminder.reminderId;

  if (categoryId) { // Modify a category
    app.data[categoryId] = category;
  } else { // Add it
    app.data[Object.keys(app.data).length] = category;
  }
  //app.data[Object.keys(app.data).length] = category;
  localStorage['app'] = JSON.stringify(app);
  $("#addNewCategory").modal('hide');

}

// Function which saves a new reminder
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
    app.data[categoryId].reminders[Object.keys(app.data[categoryId].reminders).length] = reminder;

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

//Notification and calculate time
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
