var currentMode = 'ts';
var last_activity_pt = 'Sleep';

/* selectected activities fro time spent */
var selectedActivitiesTs = []
 
var time_spent_li = document.getElementById('time_spent_li')

window.onload = init_index_html

time_spent_li.addEventListener('click', function () {
  time_spent_li.setAttribute('class', 'active')
	participation_time_li.classList.remove('active')
	
	document.getElementById('div-dropdown-ts')
		.setAttribute('style' , 'display:block')
		
	createPieMap(get_checked_activities())
	currentMode = 'ts';
})


function add_activity_ts (name) {
  var colDiv = '<div style="white-space:nowrap;overflow:hidden" class="col-md-9">' + name + '</div>'
	var check = '<div class="col-md-1"><input type="checkbox" checked></div>'
	var bin = '<div class="col-md-1"><span class="fa fa-trash"></span></div>'
	
	var div = '<div class="row selected_activities_list_ts">' + colDiv + check + bin + '</div>'
	$('#div-dropdown-ts').prepend(div)
	
	var lastActivities = $('#div-dropdown-ts').children()[0]
	selectedActivitiesTs.push(lastActivities)
	
	// click on trash
	lastActivities.children[2].children[0].addEventListener('click', function (event) {
    var element = $(event.target) // cast to jquery
		
		for (var i = 0; i < selectedActivitiesTs.length; i++)
      {if( element.parent().parent().children()[0].innerHTML == selectedActivitiesTs[i].children[0].innerHTML )
				selectedActivitiesTs.splice(i,1);}

    element.parent().parent().remove()
		
		createPieMap(get_checked_activities())
    createGrapheTimeSpent(get_checked_activities())
	})
	
	// click on checkbox
	lastActivities.children[1].children[0].addEventListener('click', function (event) {
        createGrapheTimeSpent(get_checked_activities())
		createPieMap(get_checked_activities());
	})	
}

/* returns all the checked activities among the selected activities */
function get_checked_activities () {
  var checked_activities = []
  for (var i = 0; i < selectedActivitiesTs.length; i++) {
    if (selectedActivitiesTs[i].children[1].children[0].checked) { checked_activities.push(selectedActivitiesTs[i].children[0].innerText) }
  }

  return checked_activities
}

/* creates a pop-up div to zoom on a element */
function zoom_on_element (id) {

}

/* create the activities list for time spent */
function create_list_activities_ts () {
  var dropdownListTs = d3.select('#dropdown-list-ts')
  for (let i = 0; i < activities.length; ++i) {
    dropdownListTs.append('li')
      .append('a')
      .property('href', '#')
      .property('id', i + ' ts')
      .on('click', on_itemClicked_list_activities_ts)
      .text(activities[i])
  }
}

function on_itemClicked_list_activities_ts () {
  let id = d3.select(this).attr('id')
  id = id.split(' ')
  let activity = activities[id[0]]

  add_activity_to_selected_activities(activity)
}

function add_activity_to_selected_activities (activity) {
  var selectLen = selectedActivitiesTs.length

  var isInSelectedActivities = false
  for (var i = 0; i < selectLen; i++) {
    if (activity == selectedActivitiesTs[i].children[0].innerText) {
      isInSelectedActivities = true
      break
    }
  }

  if (!isInSelectedActivities)
  {
  add_activity_ts(activity)  
	createPieMap(get_checked_activities())
	createGrapheTimeSpent(get_checked_activities())	
	}
}


function init_index_html () {
	
  var activity = 'Sleep'
  var button = document.getElementById('button_activity_ts')

  add_activity_to_selected_activities(activity)
  handle_map_size()
  var divActivity = '<div style="overflow:hidden" class="col-md-9">' + "Choose an Activity" + '</div>'
  var divCaret = '<div class="col-md-3"></span><span class="caret"></span></div>'

  button.innerHTML = '<div class="row">' + divActivity + divCaret + '</div>'
}

function handle_map_size () {
  var width = $('#page-content').parent().width()
	var height = $('#page-content').parent().height()

	if (Math.min(width, height) == height) {
    $('#map-container').attr('width', width)
		$('#map-container').attr('height', height)
	} else {
    $('#map-container').attr('width', width)
		$('#map-container').attr('height', height)
		$('#map-container').children().first().attr('width', width)
		var diff = height - width
		$('#map-container').attr('style', 'margin-top:' + (diff / 2) + ';margin-bottom:' + (diff / 2))
	}
}

function on_body_resize () {

    resizeCate()
    if( currentMode == 'ts'){
        resizePieMap()
    }
}
