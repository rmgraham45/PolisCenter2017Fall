$(document).ready(() => {
  getYears();
  getCensusType();
  getCensusPercentage('Adherents'); // Default Selection
  submitForm();

  $('#sel1').change(() => {
    const name = $('#sel1 option:selected').text();
    $('#sel2').empty();
    getCensusPercentage(name);
  });


  function setCounties() {
    if ($('input:radio[name=opt-map-geography]:checked').val() === 'COUNTY') {
      const glid = $('#sel-states').val(); // id number for states
      getCounties(glid);
      console.log('true');
    } else {
      console.log('false');
    }
  }
  $('input:radio[name=opt-map-geography]').change(() => {
    setCounties();
    console.log('counties set');
    if ($('input:radio[name=opt-map-geography]:checked').val() === 'COUNTRY') {
      $('#sel-county').empty();
    }
  });
  $('#sel-states').change(() => {
    $('#sel-county').empty();
    setCounties();
    console.log('state changed');
  });

  // Form submit function.
  function autoSubmitForm() {
    console.log('Submitting form...');
    $('#map-info').submit();
  }
  const autoSubmit = setTimeout(() => {
    autoSubmitForm();
  }, 1000);
});
