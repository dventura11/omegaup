function generateAlias(title, aliasLength) {
  // Remove accents
  title = title.latinize();

  // Replace whitespace
  title = title.replace(/\s+/g, '-');

  // Remove invalid characters
  title = title.replace(/[^a-zA-Z0-9_-]/g, '');

  title = title.substring(0, aliasLength);

  return title;
}

omegaup.OmegaUp.on('ready', function() {
  var formData = $('#form-data');
  var formName = formData.attr('data-name');
  var existsFn = null;
  var aliasLength = 0;

  function onAliasExists() {
    omegaup.UI.error('"' + omegaup.UI.escape($('#alias').val()) +
                     '" ya existe. Elige otro nombre');
    $('#alias').trigger('focus');
  }

  function onAliasNew() { omegaup.UI.dismissNotifications(); }

  switch (formName) {
    case 'problems':
      existsFn = function(alias) {
        omegaup.API.Problem.details({problem_alias: alias})
            .then(onAliasExists)
            .fail(onAliasNew);
      };
      aliasLength = 32;
      break;

    case 'groups':
      existsFn = function(alias) {
        omegaup.API.Group.details({group_alias: alias})
            .then(onAliasExists)
            .fail(onAliasNew);
      };
      aliasLength = 50;
      break;

    case 'interviews':
      existsFn = function(alias) {
        omegaup.API.Interview.details({interview_alias: alias})
            .then(onAliasExists)
            .fail(onAliasNew);
      };
      aliasLength = 32;
      break;
  }

  $('#title')
      .on('blur', function() {
        $('#alias')
            .val(generateAlias($(this).val(), aliasLength))
            .trigger('change');
      });

  $('#alias').on('change', function() { existsFn($('#alias').val()); });
});
