/** Linking UI elements on ppe-create page*/

$( "input[name=mode]" ).on( "change", function() {
	const mode = $( this ).attr("id");
  switch (mode) {
  case "availability":
    $("#ppe_info_set span").text("You'd like to share");
    $("#ppe_info_set small").text("");
    $("#ppe_info_set i").removeClass().addClass("em em-gift_heart");
    $("#name_emoji").removeClass().addClass("em em-angel");
    $("#can_buy_group").addClass('d-none');
    $("#can_buy_group input").attr('disabled', true);
    $("#remarks_group").addClass('d-none');
    $("#remarks_group textarea").attr('disabled', true);
    break;
  case "requirement":
    $("#ppe_info_set span").text("You're in need of");
    $("#ppe_info_set small").text("");
    $("#ppe_info_set i").removeClass().addClass("em em-package");
    $("#name_emoji").removeClass().addClass("em em-bust_in_silhouette");
    $("#can_buy_group").removeClass('d-none');
    $("#can_buy_group input").attr('disabled', false);
    $("#remarks_group").addClass('d-none');
    $("#remarks_group textarea").attr('disabled', true);
    break;
  case "manufacturing":
    $("#ppe_info_set span").text("You build and supply");
    $("#ppe_info_set small").text("");
    $("#ppe_info_set i").removeClass().addClass("em em-factory");
    $("#name_emoji").removeClass().addClass("em em-female-factory-worker");
    $("#can_buy_group").addClass('d-none');
    $("#can_buy_group input").attr('disabled', true);
    $("#remarks_group").removeClass('d-none');
    $("#remarks_group textarea").attr('disabled', false);
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

