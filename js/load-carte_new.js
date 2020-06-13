let countries = []
let activities = []
let dataset = new Map()
let gender = 'Total'

update()

function update() {
  d3.csv('data/tus_00week_Label.csv', label => {
    for (let i = 13; i < 34; i++) {
      countries.push(label[i]['DATASET: Time spent, participation time and participation rate in the main activity by sex and day of the week [tus_00week]'])
    };
    for (let i = 51; i < 106; i++) {
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

  d3.csv('data/tus_00week_1_Data.csv', data => {
    var geo = "";
    for (let i = 0; i < data.length; i++) {
      let l = data[i]
      geo = l.GEO;
      if(geo.includes("Germany (until 1990 former territory of the FRG)") == true){
        l.GEO = "Germany";
      }

      if ((l.DAYSWEEK === 'All days of the week') && l.ACL00 != "Total" && l.SEX==gender) {
        if (l.UNIT === 'Time spent (hh:mm)') {
          dataset.get(l.GEO).get(l.ACL00).timeSpent = l.Value
        }
      }
    }
   console.log(data)
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
