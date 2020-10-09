function goToWindow() {
    var w = window.open("", 'search');
    w.focus();

}


function disableFields(photo, spectro, apogee) {
    document.getElementById("photoScope1").disabled = photo;
    document.getElementById("photoScope2").disabled = photo;
    document.getElementById("photoScope3").disabled = photo;
    document.getElementById("photoScope4").disabled = photo;
    document.getElementById("photoUpType1").disabled = photo;
    document.getElementById("photoUpType2").disabled = photo;
    document.getElementById("joinSpec").disabled = photo;

    document.getElementById("spectroScope1").disabled = spectro;
    document.getElementById("spectroScope2").disabled = spectro;
    document.getElementById("spectroScope3").disabled = spectro;
    document.getElementById("spectroScope4").disabled = spectro;
    document.getElementById("spectroUpType1").disabled = spectro;
    document.getElementById("spectroUpType2").disabled = spectro;
    document.getElementById("joinPhoto").disabled = spectro;

    document.getElementById("apogeeScope1").disabled = apogee;
    /*
      document.getElementById("apogeeScope2").disabled = apogee;
      document.getElementById("apogeeScope3").disabled = apogee;
      document.getElementById("apogeeScope4").disabled = apogee;
    */
    document.getElementById("apogeeUpType1").disabled = apogee;
    document.getElementById("apogeeUpType2").disabled = apogee;

    if (photo == false) {
        document.getElementById("radius").disabled = document.getElementById("photoUpType2").checked;
        if (document.getElementById("photoUpType1").checked == true) {
            doRaDecSample(15.5, 0.5, 14.5, 0.6, 13.9, 0.8, 197.614, 18.438);
            doPhotoQuery(document.crossid.joinSpec.checked, false);
        } else {
            doSdssIdSample();
            doPhotoQuery(document.crossid.joinSpec.checked, true);
        }
    }
    if (spectro == false) {
        document.getElementById("radius").disabled = document.getElementById("spectroUpType2").checked;
        if (document.getElementById("spectroUpType1").checked == true) {
            doRaDecSample(15.5, 0.5, 14.5, 0.6, 13.9, 0.8, 197.614, 18.438);
            doSpecQuery(document.crossid.joinPhoto.checked, false);
        } else {
            doPmfSample();
            doSpecQuery(document.crossid.joinPhoto.checked, true);
        }
    }
    if (apogee == false) {
        document.getElementById("radius").disabled = false;
        doRaDecSample(15.5, 0.5, 14.5, 0.6, 13.9, 0.8, 197.614, 18.438);
        doApogeeQuery();
    }

    //	document.getElementById("radius").focus();
    return true;
}


function doPhotoQuery(join, sdssId) {
    var joinClause, selectClause;
    selectClause = "SELECT \n   p.objID, p.ra, p.dec, p.run, p.rerun, p.camcol, p.field,\n" +
        "   dbo.fPhotoTypeN(p.type) as type,\n" +
        "   p.modelMag_u, p.modelMag_g, p.modelMag_r, p.modelMag_i, p.modelMag_z";
    joinClause = "      JOIN #x x ON x.up_id = u.up_id\n      JOIN PhotoTag p ON p.objID = x.objID\n";
    if (join) {
        joinClause += "      JOIN SpecObjAll s ON p.objID = s.bestObjID\n";
        selectClause += ",\n   s.specObjID, s.plate, s.mjd, s.fiberID, s.z";
    }
    document.crossid.uquery.value = selectClause +
        "\nFROM #upload u\n" + joinClause +
        "ORDER by x.up_id\n";
}

function doSpecQuery(join, pmf) {
    var joinClause, selectClause;
    selectClause = "SELECT s.specobjid, s.ra, s.dec, s.plate, s.mjd, s.fiberid";
    if (pmf == true)
        joinClause = "      JOIN SpecObjAll s ON (s.plate=u.up_plate AND s.mjd=u.up_mjd AND s.fiberID=u.up_fiber)\n";
    else
        joinClause = "      JOIN #x x ON x.up_id = u.up_id\n      JOIN SpecObjAll s ON s.specObjID = x.specObjID\n";
    if (join) {
        joinClause += "      JOIN PhotoTag p ON p.objID = s.bestObjID\n";
        selectClause += ",\n p.objID, p.run, p.rerun, p.camcol, p.field";
    }
    document.crossid.uquery.value = selectClause + "\nFROM #upload u\n" + joinClause;
}

function doApogeeQuery() {
    var joinClause, selectClause;
    selectClause = "SELECT s.*";
    joinClause = "      JOIN #x x ON x.up_id = u.up_id\n      JOIN apogeestar s ON s.apstar_id = x.apstar_id\n";
    document.crossid.uquery.value = selectClause + "\nFROM #upload u\n" + joinClause;
}

function photoQuery() {
    if (document.getElementById("photoUpType1").checked == true)
        doPhotoQuery(document.crossid.joinSpec.checked, false);
    else
        doPhotoQuery(document.crossid.joinSpec.checked, true);
}

function specQuery() {
    if (document.getElementById("spectroUpType1").checked == true)
        doSpecQuery(document.crossid.joinPhoto.checked, false);
    else
        doSpecQuery(document.crossid.joinPhoto.checked, true);
}

function apogeeQuery() {
    doApogeeQuery();
}

function doRaDecSample(upRA1, upDec1, upRA2, upDec2, upRA3, upDec3, upRA4, upDec4) {
    document.getElementById("paste").value = "  name  ra         dec\n  A1    " + upRA1 + "       " + upDec1 + "\n  A2    " +
        upRA2 + "       " + upDec2 + "\n  A3    " + upRA3 + "       " + upDec3 + "\n  A4    " + upRA4 + "    " + upDec4 + "\n";
    //document.getElementById("paste").focus();
    document.getElementById("radius").disabled = false;

    if (document.getElementById("searchType1").checked == true) {
        document.getElementById("photoScope1").disabled = false;
        document.getElementById("photoScope2").disabled = false;
        document.getElementById("photoScope3").disabled = false;
        document.getElementById("photoScope4").disabled = false;
        photoQuery();
    } else if (document.getElementById("searchType2").checked == true) {
        document.getElementById("spectroScope1").disabled = false;
        document.getElementById("spectroScope2").disabled = false;
        document.getElementById("spectroScope3").disabled = false;
        document.getElementById("spectroScope4").disabled = false;
        specQuery();
    } else if (document.getElementById("searchType3").checked == true) {
		/*
    document.getElementById("apogeeScope1").disabled = false;
		document.getElementById("apogeeScope2").disabled = false;
		document.getElementById("apogeeScope3").disabled = false;
		document.getElementById("apogeeScope4").disabled = false;
    */
        apogeeQuery();
    }

    document.getElementById("firstcol").value = "1";
}

function doLBSample() {
    document.getElementById("paste").value = "l          b\n58.92724   40.46582\n"
    document.getElementById("firstcol").value = "0";
}

function doSdssIdSample() {
    document.getElementById("paste").value = "run rerun camcol field obj\n3964  301    4   265   219\n3185  301    1   091   324\n3918  301    2   366   065\n";
    //document.getElementById("paste").focus();
    document.getElementById("radius").disabled = true;
    //document.getElementById("radius").focus();
    document.getElementById("photoScope1").disabled = true;
    document.getElementById("photoScope2").disabled = true;
    document.getElementById("photoScope3").disabled = true;
    document.getElementById("photoScope4").disabled = true;
    document.getElementById("firstcol").value = "0";
    photoQuery();
}

function doPmfSample() {
    document.getElementById("paste").value = " plate  mjd fiber\n 272  51941 368\n 287  52023 582\n 288  52000 446\n";
    //document.getElementById("paste").focus();
    document.getElementById("radius").disabled = true;
    //document.getElementById("radius").focus();
    document.getElementById("spectroScope1").disabled = true;
    document.getElementById("spectroScope2").disabled = true;
    document.getElementById("spectroScope3").disabled = true;
    document.getElementById("spectroScope4").disabled = true;
    document.getElementById("firstcol").value = "0";
    specQuery();
}
function resetRadio() {
    var photo = !document.getElementById("searchType1").checked;
    var spectro = !document.getElementById("searchType2").checked;
    var apogee = !document.getElementById("searchType3").checked;

    document.getElementById("photoScope1").disabled = photo;
    document.getElementById("photoScope2").disabled = photo;
    document.getElementById("photoScope3").disabled = photo;
    document.getElementById("photoScope4").disabled = photo;
    document.getElementById("photoUpType1").disabled = photo;
    document.getElementById("photoUpType2").disabled = photo;
    document.getElementById("joinSpec").disabled = photo;

    document.getElementById("spectroScope1").disabled = spectro;
    document.getElementById("spectroScope2").disabled = spectro;
    document.getElementById("spectroScope3").disabled = spectro;
    document.getElementById("spectroScope4").disabled = spectro;
    document.getElementById("spectroUpType1").disabled = spectro;
    document.getElementById("spectroUpType2").disabled = spectro;
    document.getElementById("joinPhoto").disabled = spectro;

    document.getElementById("apogeeScope1").disabled = apogee;
    /*
      document.getElementById("apogeeScope2").disabled = apogee;
      document.getElementById("apogeeScope3").disabled = apogee;
      document.getElementById("apogeeScope4").disabled = apogee;
    */
    document.getElementById("apogeeUpType1").disabled = apogee;
    document.getElementById("apogeeUpType2").disabled = apogee;
}document.addEventListener("load", resetRadio());