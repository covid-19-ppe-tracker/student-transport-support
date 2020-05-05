/** Linking UI elements on ppe-create page*/

$( "input[name=mode]" ).on( "change", function() {
	const mode = $( this ).attr("id");
  switch (mode) {
  case "availability":
    $("#ppe-info-set span").text("You'd like to share");
    $("#ppe-info-set small").text("");
    $("#ppe-info-set i").removeClass().addClass("em em-gift_heart");
    $("#name_emoji").removeClass().addClass("em em-angel");
    $("#can_buy_group").addClass('d-none');
    $("#can_buy_group input").attr('disabled', true);
    break;
  case "requirement":
    $("#ppe-info-set span").text("You're in need of");
    $("#ppe-info-set small").text("");
    $("#ppe-info-set i").removeClass().addClass("em em-package");
    $("#name_emoji").removeClass().addClass("em em-bust_in_silhouette");
    $("#can_buy_group").removeClass('d-none');
    $("#can_buy_group input").attr('disabled', false);
    break;
  case "manufacturing":
    $("#ppe-info-set span").text("You build and supply");
    $("#ppe-info-set small").text("");
    $("#ppe-info-set i").removeClass().addClass("em em-factory");
    $("#name_emoji").removeClass().addClass("em em-female-factory-worker");
    $("#can_buy_group").addClass('d-none');
    $("#can_buy_group input").attr('disabled', true);
    break;
  }
});

$( "input[name=kind]" ).on( "change", function() {
	const mode = $( this ).attr("id");
  switch (mode) {
  case "file":
    $("#proof_kind_label").text("Upload");
    $("#hyperlink_evidence").removeAttr("required").prop("hidden", true);;
    $("#file_evidence").prop("required", true).prop("hidden", false);
    break;
  case "hyperlink":
    $("#proof_kind_label").text("URL");
    $("#file_evidence").removeAttr("required").prop("hidden", true);
    $("#hyperlink_evidence").prop("required", true).prop("hidden", false);
    break;
  }
});

$("#add-another").on("click", function(){
  let newRecord = $("#record").clone()
  newRecord.appendTo("#ppe-info-set")
  newRecord.append(`
  <div class="col-lg-1">
      <aside class="d-none d-lg-block btn btn-small btn-danger fa fa-times remove-record mr-1"></aside>
      <a class="d-block d-lg-none btn btn-small btn-danger remove-record mr-1 text-light">Remove</a>
  </div>
  `);
  $(".remove-record").on("click", function(){
    $(this).parent().parent().remove();
  })
  
})

