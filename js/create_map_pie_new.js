let resizeTime = 500
let colorTime = 1000
let scaleC
let mapColor = "Greens" //'PuRd'
let defaultMapColor = '#BDBDBD'
let svgMap = d3.select('#map-container')
let mapContainer = svgMap.append('g').attr('id', 'map')
let pieContainer = svgMap.append('g').attr('id', 'pies')
let legendCOntainer = svgMap.append('g').attr('id', 'legend')

let mapData
let sTimeList = []
let pieScale
let path


/*** Setting for pie***/
let pie = d3.pie().value(d => {
    return d.value
})

let arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(d => d.data.radius)


function getActivity () {
  console.log('Get activities：', document.getElementById('activities').value)

  return document.getElementById('activities').value
}

function getSTColor (d) {
  let val = 0
  let i = 0
  for (i = 0; i < sTimeList.length; i++) {
    // console.log(sTimeList[i].country, d.properties.NAME, sTimeList[i].total)
    if (sTimeList[i].country !== d) continue
    val = sTimeList[i].total
    break
  }

  if (isNaN(val) || i === sTimeList.length) {
    return defaultMapColor
  } else {
    return scaleC(val)
  }
}

/**
 * This function will process the data for the spent time map.
 **/
function getSpentTimeList (activities) {
  if (!isArray(activities)) {
    console.log('getsTimeListMap(): Expected Array, but get ', activities)
    return false
  }



  console.log('getSpentTimeList(): Get activities list:', activities)

  for (let country_info of sTimeList) {
    country_info.total = 0.0
    country_info.values = []

    for (let activity of activities) {
      let str = String(
        dataset.get(country_info.country).get(activity).timeSpent
      )

      let splittedStr = str.split(':')
      let hh = parseInt(splittedStr[0])
      let mm = parseInt(splittedStr[1])
      let aTime = hh * 60 + mm
      aTime = isNaN(aTime) ? 0 : aTime
      country_info.values.push({
        activity: activity,
        value: aTime
      })

      country_info.total += aTime
    }
  }

  console.log('getsTimeListMap(): Get activities List:', sTimeList)
  return true
}

function loadMap (dataset, mode) {
  console.log('Start to load map to :', svgMap)
  d3.json('data/europe.json', function (error, map_json) {
    mapData = map_json
    initSpList()
    if (mode == 'ts') { createPieMap(get_checked_activities()) } else { createPTMap(last_activity_pt) }
  })
}

function initSpList () {
  for (let countryFeature of mapData.features) {
    // console.log(countries.includes(countryFeature.properties.NAME))
    if (countries.includes(countryFeature.properties.NAME)) {
      let countryInfo = {
        country: countryFeature.properties.NAME,
        feature: countryFeature,
        total: 0.0,
        values: []
      }
      sTimeList.push(countryInfo)
    }
  }
}

// put all logic in a nice reusable function
function createPieMap (activities) {
    if (mapData == null){
        console.log("Can not get data map!")
        return false
    }

    if (activities.length <= 1){
      
    }

  //   activities = ['Personal care', 'Other and/or unspecified personal care']
  let width = $('#page_content').width()
  let height = $('#page_content').height()
  svgMap = d3.select('#map-container').attr('width', width).attr('height', height)

  getSpentTimeList(activities)
  updatePieMapScale(activities)
  updateLegend()
  // use viewBox attributes instead of width + height

  console.log('Map size', width, height)

  let projection = d3
    .geoMercator()
     .fitSize([width, height], mapData)

  // this is the function that generates position data from the projection
  path = d3.geoPath().projection(projection)

  // append country outlines
  let countries_enter = mapContainer
    .selectAll('.country')
    .data(mapData.features, d => d.properties.NAME)
    .enter()
    .append('g')
    .attr('class', 'country')

  countries_enter
    .append('path')
    .attr('class', 'country_path')
    .attr('d', path)
    .attr('country', d => d.properties.NAME.replace(" ", "_"))
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('fill', d => getSTColor(d.properties.NAME))

  countries_enter
    .append('title')
    .attr('class', 'country_title')
    .text((d) => d.properties.NAME)

  mapContainer
    .selectAll('.country_path')
    .data(mapData.features, d => d.properties.NAME)
      .on("mouseover", function(d,i){
          d3.selectAll("[country=" + d.properties.NAME.replace(/\s/g,"_") +"]").attr('fill', 'orange')
      })
      .on("mouseout", function(d,i){
          d3.selectAll("path[country=" + d.properties.NAME.replace(/\s/g,"_") +"]")
          // .select("path")
              .attr('fill', d => getSTColor(d.properties.NAME))

          d3.selectAll("rect[country=" + d.properties.NAME.replace(/\s/g,"_") +"]")
          // .select("path")
              .attr('fill', 'blue')

          d3.selectAll("circle[country=" + d.properties.NAME.replace(/\s/g,"_") +"]")
          // .select("path")
              .attr('fill', 'black')
      })
    .transition()
    .duration(500)
    .attr('fill', d => getSTColor(d.properties.NAME))


  mapContainer
    .selectAll('.country_title')
    .data(mapData.features, d => d.properties.NAME)
    .text(d => d.properties.NAME)


  mapContainer
    .selectAll('.country')
    .data(mapData.features, d => d.properties.NAME)
    .transition()
    .duration(1000)
    .attr('fill', d => getSTColor(d.properties.NAME))

  /** ************** Draw pie   ************************/
  
  let points = pieContainer
  .selectAll('.pie')
  .data(sTimeList, d => d.country)
  .enter()
  .append('g')
  .attr('class', 'pie')
  .attr('country', d => d.country.replace(" ", "_"))
  .attr('transform', d => {
    const centroid = path.centroid(d.feature)
    return `translate(${centroid[0]}, ${centroid[1]})`
  })

points = pieContainer.selectAll('.pie').data(sTimeList, d => d.country)

  points.transition().duration(500).attr('transform', d => {
      const centroid = path.centroid(d.feature)
      return `translate(${centroid[0]}, ${centroid[1]})`
  })


let allPies = points.selectAll('.arc').data(d => {
  d.values.map(t => {
    t.radius = (0.618 * Math.sqrt(path.area(d.feature))) / 2
    return d
  })
  return pie(d.values)
}, d => d.data.activity)

let pieArcs = allPies
  .enter()
  .append('path')
  .attr('class', 'arc')
  .attr('opacity', 1)
  .attr('fill', d => pieScale(d.data.activity))

  pieArcs.transition()
      .duration(500)
      .attrTween('d', d => arcTween(d, arc))

  pieArcs
      .append('title')
      .text(d => {
              return pieTips(d)
          })
allPies
      .attr('fill', function (d, i) {
          return pieScale(d.data.activity)
      })
      .transition()
      .duration(500)
      .attrTween('d', d => arcTween(d, arc))

allPies.exit().remove()

if(activities.length <= 1){
  //If there is only one activity, we should not display the piechart
  pieContainer.selectAll(".pie").remove()
}

  let zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', zoomed)

  d3.select('#map-container').call(zoom)
}

function zoomed () {
  d3.select('#map').attr('transform',
    'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ')scale(' + d3.event.transform.k + ')')

  d3.selectAll('path').attr('stroke-width', 1 / d3.event.transform.k)

  d3.select('#pies').attr('transform',
    'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ')scale(' + d3.event.transform.k + ')')
}

function updateLegend () {
  var legend = d3.legendColor()
    .labels(function ({
      i,
      genLength,
      generatedLabels,
      labelDelimiter
    }) {
      if (i === 0) {
        const values = generatedLabels[i].split(` ${labelDelimiter} `)
        return `Less than ${nbToString(values[1])}`
      } else if (i === genLength - 1) {
        const values = generatedLabels[i].split(` ${labelDelimiter} `)
        return `${nbToString(values[0])} or more`
      } else {
        const values = generatedLabels[i].split(` ${labelDelimiter} `)
        return `${nbToString(values[0])} to ${nbToString(values[1])}`
      }
    })
    .scale(scaleC)

  d3.select('#legend')
    .call(legend)
}


function updatePieMapScale (activities) {
  getSpentTimeList(activities)
  let result = sTimeList.filter(t => t.total > 0.0)
  let minSTime = d3.min(result, d => d.total)
  let maxSTime = d3.max(sTimeList, d => d.total)

  console.log('updateScale():', 'Get new range:[', minSTime, maxSTime, ']')

  pieScale = d3
    .scaleOrdinal('schemeCategory20')
    .domain(activities)
    .range(d3.schemeCategory20)

  scaleC = d3
    .scaleThreshold()
    .domain(
      d3.range(9).map(function (d) {
        return minSTime + (d * (maxSTime - minSTime)) / 8
      })
    )
    .range(colorbrewer[mapColor][9])
}


function arcTween (d, arc) {
  d.innerRadius = 0
  var i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
  return function (t) { return arc(i(t)) }
}

function isArray (value) {
  return value && typeof value === 'object' && value.constructor === Array
}

function nbToString (min) {
  return d3.format('02d')(Math.floor(min / 60)) + 'H' + d3.format('02d')(min % 60)
}


function pieTips (d) {
  return d.data.activity + '\n' + nbToString(d.value)
}


function resizeCate(){
    let width = $('#page_content').width()
    let height = $('#page_content').height()

    svgMap = d3.select('#map-container').attr('width', width).attr('height', height)

    let projection = d3
        .geoMercator()
        // d3's 'fitSize' magically sizes and positions the map for you
        .fitSize([width, height], mapData)
    // this is the function that generates position data from the projection
    path = d3.geoPath().projection(projection)

    mapContainer
        .selectAll('.country_path')
        .data(mapData.features, d => d.properties.NAME)
        .transition()
        .duration(500)
        .attr('d', path)
}


function resizePieMap(){
    let pie = d3.pie().value(d => {
        return d.value
    })

    var arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(d => d.data.radius)

    let points = pieContainer
        .selectAll('.pie')
        .data(sTimeList, d => d.country)

        points.transition().duration(resizeTime)
        .attr('transform', d => {
            const centroid = path.centroid(d.feature)
            return `translate(${centroid[0]}, ${centroid[1]})`
        })


   points.selectAll('.arc').data(d => {
        d.values.map(t => {
            t.radius = (0.618 * Math.sqrt(path.area(d.feature))) / 2
            return d
        })
        return pie(d.values)
    }, d => d.data.activity)
        .transition()
        .duration(resizeTime)
        .attr('d', arc)

}