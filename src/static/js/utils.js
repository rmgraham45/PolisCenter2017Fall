function getYears() {
  const url = 'https://in-polis-app28.ads.iu.edu/daarws/religioncensusvariables.xml';
  $.ajax({
    // Get list of applicable years and appends the value to dropdown menu
    type: 'GET',
    url,
    success(xml) {
      $(xml).find('ReligionCensusYear').each(function () {
        const year = $(this).attr('data');
        $('#sel3').append(`<option value='${year}'>${year}</option>`);
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
      // console.log(xml)

      $(xml)
        .find('ReligionCensusYear')
        .first()
        .next()
        .find('ReligionCensusVariable')
        .each(function () {
          const $this = $(this);
          typeLabel = $this.attr('label');
          typeData = $this.attr('data');
          $('#sel1')
            .append(`<option value='${typeData}'>${typeLabel}</option>`);
        });
    },
    error(error) {
      // alert(error);
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
      // console.log(xml)

      $(xml)
        .find(`ReligionCensusYear:first ReligionCensusVariable[label='${name}'] NormalizationVariable`)
        .each(function () {
          percentageLabel = $(this).attr('label');
          percentageData = $(this).attr('data');
          // console.log(percentageData);
          // console.log(percentageLabel);
          $('#sel2')
            .append(`<option value='${percentageData}'>${percentageLabel}</option>`);
        });
    },
    error(error) {
      // alert(error);
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
      // console.log(xml)
      $(xml)
        .find('Counties Item data')
        .each(function () {
          if ($(this).text() === value) {
            const data = $(this).siblings('data1').text();
            const label = $(this).siblings('label').text();
            $('#map-geography').append(function () {
              $('#sel-county')
                .append(`<option value='${data}'>${label}</option>`);
            }); // form
          }
        });
    },
    error(error) {
      // alert(error);
      console.log(error);
    },
  });
}

function submitForm() {
  $('#map-info').on('submit', (e) => {
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
      parameters; // parameters for the query to ajax

    if (!$('#sel-county option:selected').length) {
      glid = '011'; // gets global identifier for state or county. 011 = US
    } else {
      glid = $('#sel-county').val();
    }

    parameters = {
      geog: $('input:radio[name=opt-map-geography]:checked').val(),
      rcvi: $('#sel2').val(),
      DominantReligion: $('input:radio[name=opt-map-representation]:checked').val(),
      dy: $('#sel3').val(),
      glid,
      dy2: $('#sel3').val(),
      rcvi2: $('#sel1').val(),
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