let countries = []
let activities = []
let dataset = new Map()
let gender = 'Total'

update()

function update() {
  d3.csv('data/label.csv', label => {
    for (let i = 13; i < 34; i++) {
      countries.push(label[i]['DATASET: Time spent, participation time and participation rate in the main activity by sex and day of the week [tus_00week]'])
    };
    for (let i = 46; i < 101; i++) {
      activities.push(label[i]['DATASET: Time spent, participation time and participation rate in the main activity by sex and day of the week [tus_00week]'])
    };
  
    for (let i = 0; i < countries.length; i++) {
      let map = new Map()
      for (let j = 0; j < activities.length; j++) {
        let objet = { participationTime: 0, participationRate: 0, timeSpent: 0 }
        map.set(activities[j], objet)
      }
      dataset.set(countries[i], map)
    }
  })

  d3.csv('data/TimeUseData.csv', data => {
    for (let i = 0; i < data.length; i++) {
      let l = data[i]
      if ((l.DAYSWEEK === 'All days of the week') && (l.SEX === gender)) {
        if (l.UNIT === 'Time spent (hh:mm)') {
          dataset.get(l.GEO).get(l.ACL00).timeSpent = l.Value
        }
        if (l.UNIT === 'Participation time (hh:mm)') {
          dataset.get(l.GEO).get(l.ACL00).participationTime = l.Value
        }

        if (l.UNIT === 'Participation rate (%)') {
          dataset.get(l.GEO).get(l.ACL00).participationRate = l.Value
        }
      }
    }
  
      create_list_activities_ts()
      handle_map_size()
      // console.log(dataset.get("Norway"))
			loadMap (dataset, "ts")
			createGrapheTimeSpent(get_checked_activities())
  })
}

d3.selectAll("input[name='gender']").on('change', function(){
  val = []
  d3.selectAll("input[name='gender']").each(function(_,i){
    chkbx = d3.select(this)
    if (chkbx.property('checked')) {
      val.push(chkbx.property('value'))
    }
  })
  if (val.length == 2) {
    gender = 'Total'
  }
  else if (val.length == 1) {
    gender = val[0]
  }
  else {
    gender = 'None'
  }
  countries = []
  activities = []
  dataset = new Map()
  update()
})
