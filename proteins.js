var couchdb = 'https://edwardslab.bmcb.georgetown.edu/couchdb/';
var database = 'ss4218_dbsnp';
var database2 = 'ss4218_uniprot';
var database3 = 'ss4218_omim';

function wsurl(request) {
	return couchdb + database + request;
};

function wsurl1(request) {
	return couchdb + database2 + request;
};

function wsurl2(request) {
	return couchdb + database3 + request;
};

var skip = 0;
var page = 20;
var sort = "";
var sortdir = "";
var term = "";


function keypress(ele, event) {
	term = ele.value;
	skiptozero();
	return true;
};

function keypress1(ele, event) {
	term = ele.value;
	skiptozero1();
	return true;
};

function keypress2(ele, event) {
	term = ele.value;
	skiptozero2();
	return true;
};

function change(ele) {
	term = ele.value;
	skiptozero();
}

function change1(ele) {
	term = ele.value;
	skiptozero1();
}

function change2(ele) {
	term = ele.value;
	skiptozero2();
}


function addtoskip(value) {
	skip += value;
	renderproteins();
}

function addtoskip1(value) {
	skip += value;
	renderuniprotS();
}

function addtoskip2(value) {
	skip += value;
	renderdiseaseS();
}


function skiptozero() {
	skip = 0;
	renderproteins();
}

function skiptozero1() {
	skip = 0;
	renderuniprotS();
}

function skiptozero2() {
	skip = 0;
	renderdiseaseS();
}


// this is actually a renderdbsnps function// 
function renderproteins() {
	var criteria = { "selector": {}, "sort": [], "limit": (page + 1), "skip": skip };
	if (term != "") {
		var caseinsensitiveterm = "(?i)" + term;
		criteria["selector"] = {
			"$or": [{ "rsID": { "$regex": caseinsensitiveterm } },
			{ "aaChange": { "$regex": caseinsensitiveterm } },
			{ "Gene": { "$elemMatch": { "name.value": { "$regex": caseinsensitiveterm } } } }]
		}
	}
	json_ws_post(wsurl('/_find'), criteria, function (data) {
		console.log(data);
		var table = '';
		table += '<table>';
		table += '<tr>';
		table += '<th>Index</th>';
		table += '<th onclick="sorttable(this);">dbSNP rsID</th>';
		table += '<th onclick="sorttable(this);">Amino Acid Change</th>';
		table += '<th onclick="sorttable(this);">Gene</th>';
		table += '</tr>';
		for (var i = 0; i < Math.min(data.docs.length, page); i++) {
			table += "<tr>";
			table += "<td>" + (i + 1 + skip) + "</td>";
			table += "<td>" + "<A href=\"#\" onclick=\"renderprotein(this.text);\">" +
				data.docs[i].rsID + "</A></td>";
			table += "<td>" + data.docs[i].aaChange + "</td>";
			table += "<td>" + data.docs[i].Gene + "</td>";

			table += "</tr>";
		}
		table += "</table>";
		table += "<div style=\"float:right;\"><P>";
		var needsep = false;
		if (skip > 0) {
			table += "<A href=\"#\" onclick=\"skiptozero();\">Beginning</A>";
			table += " - <A href=\"#\" onclick=\"addtoskip(-page);\">Previous</A>";
			needsep = true;
		}
		if (data.docs.length > page) {
			if (needsep) {
				table += " - ";
			}
			table += "<A href=\"#\" onclick=\"addtoskip(page);\">Next</A>";
		}
		table += "</P></div>"
		document.getElementById('container').innerHTML = table;
		document.getElementById('search').className = "show";
	});
	return true;
}



//this is actually  a render dbsnp function//
function renderprotein(accession) {
  var criteria = {"selector": {"rsID": accession}, "limit": 1};
  json_ws_post(wsurl('/_find'),criteria,function(data) {
	//console.log(data);
    var table = "<table>";
	table += "<tr><th>Accession</th><td>" + data.docs[0].rsID + "</td></tr>";
	table += "<tr><th>Amino Acid Change</th><td>" + data.docs[0].aaChange + "</td></tr>";
	table += "<tr><th>Chromosome Coordinate</th><td>" + data.docs[0].ChromosomeCoordinate + "</td></tr>";
	  table += "<tr><th>Major Allele Population Frequency</th><td>" + data.docs[0].MajorAllele +": " + data.docs[0].Frequency + "</td></tr>";
	table += "<tr><th>Gene</th><td>" + data.docs[0].Gene + "</td></tr>";
	table += "<tr><th>Cytogenic Band</th><td>" + data.docs[0].CytogenicBand + "</td></tr>"
	table += "<tr><th>Ensembl Gene ID</th><td>" + data.docs[0].ENSEMBL_GeneID + "</td></tr>"
	
	var diseases = data.docs[0].Diseases;

	for (var j = 0; j < diseases.length; j++) {
		table += "<tr><th>Omim ID</th><td>" + diseases[j].omimID + "</td></tr>";
	  }
	for (var j = 0; j < diseases.length; j++) {
		table += "<tr><th>Disease</th><td>" + diseases[j].diseaseName + " , " + diseases[j].diseaseAbbreviation + "</td></tr>";
	  }
	var proteins = data.docs[0].Proteins;
	for (var j = 0; j < proteins.length; j++) {
		  table += "<tr><th>Uniprot Accession</th><td>" + proteins[j].uniprot_accession + "</td></tr>";
	  }

	table += "</table>";
	table += "<P align=\"right\"><A href=\"#\" onclick=\"renderproteins();\">Return</A></P>"
    document.getElementById('container').innerHTML = table;
	document.getElementById('search').className = "hide";
  });
}

function renderuniprotS() {
	var criteria = { "selector": {}, "sort": [], "limit": (page + 1), "skip": skip };
	if (term != "") {
		var caseinsensitiveterm = "(?i)" + term;
		criteria["selector"] = {
			"$or": [{ "Protein_Accession": { "$regex": caseinsensitiveterm }}]
		}
	}
	json_ws_post(wsurl1('/_find'), criteria, function (data) {
		console.log(data);
		var table = '';
		table += '<table>';
		table += '<tr>';
		table += '<th>Index</th>';
		table += '<th onclick="sorttable(this);">Uniprot Accession</th>';

		table += '</tr>';
		for (var i = 0; i < Math.min(data.docs.length, page); i++) {
			table += "<tr>";
			table += "<td>" + (i + 1 + skip) + "</td>";
			table += "<td>" + "<A href=\"#\" onclick=\"renderuniprot(this.text);\">" +
				data.docs[i].Protein_Accession + "</A></td>";
	

			table += "</tr>";
		}
		table += "</table>";
		table += "<div style=\"float:right;\"><P>";
		var needsep = false;
		if (skip > 0) {
			table += "<A href=\"#\" onclick=\"skiptozero1();\">Beginning</A>";
			table += " - <A href=\"#\" onclick=\"addtoskip1(-page);\">Previous</A>";
			needsep = true;
		}
		if (data.docs.length > page) {
			if (needsep) {
				table += " - ";
			}
			table += "<A href=\"#\" onclick=\"addtoskip1(page);\">Next</A>";
		}
		table += "</P></div>"
		document.getElementById('container').innerHTML = table;
		document.getElementById('search').className = "show";
	});
	return true;
}

function renderuniprot(accession) {
	var criteria = { "selector": { "Protein_Accession": accession }, "limit": 1 };
	json_ws_post(wsurl1('/_find'), criteria, function (data) {
		console.log(data);
		var table = "<table>";
		table += "<tr><th>Uniprot Accession</th><td>" + data.docs[0].Protein_Accession + "</td></tr>";
		table += "<tr><th>Protein Molecular Weight in Daltons</th><td>" + data.docs[0].Protein_Molecular_Weight + "Da"+ "</td></tr>";
		var snps = data.docs[0].SNPs;
		var diseases = data.docs[0].Diseases;
		for (var j = 0; j < snps.length; j++) {
			table += "<tr><th>Gene, Associated dbSNPs, Amino Acid Change </th><td>" + snps[j].Gene + ", " + snps[j].rsID + ", " + snps[j].aaChange+  "</td></tr>";
		}
		for (var j = 0; j < diseases.length; j++) {
			table += "<tr><th>Omim ID and Disease Abbreviation</th><td>" + diseases[j].omimID + "," + diseases[j].diseaseAbbreviation +"</td></tr>";
		 }

		table += "</table>";
		table += "<P align=\"right\"><A href=\"#\" onclick=\"renderuniprotS();\">Return</A></P>"
		document.getElementById('container').innerHTML = table;
		document.getElementById('search').className = "hide";
	});
}



function renderdiseaseS() {
	var criteria = { "selector": {}, "sort": [], "limit": (page + 1), "skip": skip };
	if (term != "") {
		var caseinsensitiveterm = "(?i)" + term;
		criteria["selector"] = {
			"$or": [{ "omimID": { "$regex": caseinsensitiveterm } },
			{ "diseaseAbbreviation": { "$regex": caseinsensitiveterm } },
			{ "diseaseName": { "$elemMatch": { "name.value": { "$regex": caseinsensitiveterm } } } }]
		}
	}
	json_ws_post(wsurl2('/_find'), criteria, function (data) {
		var table = '';
		table += '<table>';
		table += '<tr>';
		table += '<th>Index</th>';
		table += '<th onclick="sorttable(this);">ID</th>';
		table += '<th onclick="sorttable(this);">Disease Abbreviation</th>';
		table += '<th onclick="sorttable(this);">Disease Name</th>';
		table += '</tr>';
		for (var i = 0; i < Math.min(data.docs.length, page); i++) {
			table += "<tr>";
			table += "<td>" + (i + 1 + skip) + "</td>";
			table += "<td>" + "<A href=\"#\" onclick=\"renderdisease(this.text);\">" +
				data.docs[i]._id + "</A></td>";
			table += "<td>" + data.docs[i].diseaseAbbreviation + "</td>";
			table += "<td>" + data.docs[i].diseaseName + "</td>";

			table += "<td>";
			if (data.docs[i].gene) {
				for (var j = 0; j < data.docs[i].gene.length; j++) {
					if (data.docs[i].gene[j] && data.docs[i].gene[j].name) {
						table += (data.docs[i].gene[j].name.value + " ");
					}
				}
			}
			table += "</td>";
			table += "</tr>";
		}
		table += "</table>";
		table += "<div style=\"float:right;\"><P>";
		var needsep = false;
		if (skip > 0) {
			table += "<A href=\"#\" onclick=\"skiptozero2();\">Beginning</A>";
			table += " - <A href=\"#\" onclick=\"addtoskip2(-page);\">Previous</A>";
			needsep = true;
		}
		if (data.docs.length > page) {
			if (needsep) {
				table += " - ";
			}
			table += "<A href=\"#\" onclick=\"addtoskip2(page);\">Next</A>";
		}
		table += "</P></div>"
		document.getElementById('container').innerHTML = table;
		document.getElementById('search').className = "show";
	});
	return true;
}

function renderdisease(accession) {
	var criteria = { "selector": { "_id": accession }, "limit": 1 };
	json_ws_post(wsurl2('/_find'), criteria, function (data) {
		//console.log(data);
		var table = "<table>";
		//table += "<tr><th>Accession</th><td>" + data.docs[0]._id + "</td></tr>";//
		table += "<tr><th>Omim ID</th><td>" + data.docs[0].omimID + "</td></tr>";
		table += "<tr><th>Disease Name</th><td>" + data.docs[0].diseaseName + "</td></tr>";
		table += "<tr><th>Disease Abbreviation</th><td>" + data.docs[0].diseaseAbbreviation + "</td></tr>";
		var snps = data.docs[0].SNPs;
		var proteins = data.docs[0].proteins;
		for (var j = 0; j < snps.length; j++) {
			table += "<tr><th>Gene, Associated dbSNPs, Amino Acid Change </th><td>" + snps[j].Gene + ", " + snps[j].rsID + ", " + snps[j].aaChange + "</td></tr>";
		}
		for (var j = 0; j < proteins.length; j++) {
			table += "<tr><th>Uniprot Accession </th><td>" + proteins[j].uniprot_accession +"</td></tr>";
		}

		table += "</td></tr>";
		table += "</table>";
		table += "<P align=\"right\"><A href=\"#\" onclick=\"renderdiseaseS();\">Return</A></P>"
		document.getElementById('container').innerHTML = table;
		document.getElementById('search').className = "hide";
	});
}
