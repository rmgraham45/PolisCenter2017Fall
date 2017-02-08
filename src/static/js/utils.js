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
          console.log(percentageData);
          console.log(percentageLabel);
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

function deleteSvg() {
  $('svg').remove();
}