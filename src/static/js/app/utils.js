function getYears() {
  const url = 'https://in-polis-app28.ads.iu.edu/daarws/religioncensusvariables.xml';
  $.ajax({
    // Get list of applicable years and appends the value to dropdown menu
    type: 'GET',
    url,
    success(xml) {
      $(xml).find('ReligionCensusYear').each(function () {
        const year = $(this).attr('data');
        $('#sel-year').append(`<option value='${year}'>${year}</option>`);
      });
    },
  });
}

function getCensusType() {
  const url = 'https://in-polis-app28.ads.iu.edu/daarws/religioncensusvariables.xml';
  $.ajax({
    // Get list of applicable years and appends the value to dropdown menu
    type: 'GET',
    url,
    success(xml) {
      $(xml)
        .find('ReligionCensusYear')
        .first()
        .next()
        .find('ReligionCensusVariable')
        .each(function () {
          const $this = $(this);
          typeLabel = $this.attr('label');
          typeData = $this.attr('data');
          $('#sel-map-type')
            .append(`<option value='${typeData}'>${typeLabel}</option>`);
        });
    },
    error(error) {
      console.log(error);
    },
  });
}

function getCensusPercentage(name) {
  const url = 'https://in-polis-app28.ads.iu.edu/daarws/religioncensusvariables.xml';
  $.ajax({
    // Get list of applicable years and appends the value to dropdown menu
    type: 'GET',
    url,
    success(xml) {
      $(xml)
        .find(`ReligionCensusYear:first ReligionCensusVariable[label='${name}'] NormalizationVariable`)
        .each(function () {
          percentageLabel = $(this).attr('label');
          percentageData = $(this).attr('data');
          $('#sel-map-percentage')
            .append(`<option value='${percentageData}'>${percentageLabel}</option>`);
        });
    },
    error(error) {
      console.log(error);
    },
  });
}

function getCounties(value) {
  const url = 'https://in-polis-app28.ads.iu.edu/daarws/counties.xml';
  $.ajax({
    // Get list of applicable years and appends the value to dropdown menu
    type: 'GET',
    url,
    success(xml) {
      $(xml)
        .find('Counties Item data')
        .each(function () {
          if ($(this).text() === value) {
            const label = $(this).siblings('label').text();
            const fips = $(this).siblings('fips').text();
            $('#map-geography').append(function () {
              $('#sel-county')
                .append(`<option value='${fips}'>${label}</option>`);
            }); // form
          }
        });
    },
    error(error) {
      console.log(error);
    },
  });
}

function submitForm() {
  $('#map-info').on('submit', (e) => {
    // submits form via ajax get
    e.preventDefault();
    let geog,
      rcvi,
      DominantReligion,
      dy,
      glid,
      dy2,
      rcvi2,
      NumberofClusters,
      ColorScheme,
      DenomFamily,
      DenomFamily2,
      FromPie,
      parameters,
      data; // parameters for the query to ajax

    if (!$('#sel-county option:selected').length) {
      glid = '011'; // gets global identifier for state or county. 011 = US
    } else {
      glid = $('#sel-county').val();
    }

    if ($("#sel-map-type").val() === '1' && $("#sel-map-percentage").val() === '1' ) {
      rcvi2 = '5'
    } else {
      rcvi2 = $('#sel-map-percentage').val()
    }

    parameters = {
      geog: $('input:radio[name=opt-map-geography]:checked').val(),
      rcvi: $('#sel-map-percentage').val(),
      DominantReligion: $('input:radio[name=opt-map-representation]:checked').val(),
      dy: $('#sel-year').val(),
      glid,
      dy2: $('#sel-year').val(),
      rcvi2 ,
      NumberofClusters: '5',
      ColorScheme: 'Reds',
      DenomFamily: '0',
      DenomFamily2: '0',
      FromPie: 'true',
    };
    $form = $('form.map-info');
    console.log(parameters);
    parameters = $.param(parameters);
    const url = 'https://in-polis-app28.ads.iu.edu/daarws/GetTreeMapData.aspx?';
    deleteSvg();
    visualizePieChart(url + parameters);
  });
}

function deleteSvg() {
  $('svg').remove();
}

function getDmd() {
  $.ajax({
    // Get list of applicable years and appends the value to dropdown menu
    type: 'GET',
    url: 'http://localhost:8000/data/dmd.json',
    success(data) {
      console.log(data)
    },
    error(error) {
      console.log(error);
    },
  });
}
