tar_melement = {
	init : function() {
		tar_mselect.init();
		tar_mtag.init();
	}
}

tar_mselect = {
	init : function() {
		$(".mselect").each(function(){
			tar_mselect.build(this);
		});
		tar_mselect.eventsetup();
	},
	addboxstring : function(thisid) {
		thisid = thisid.substr(4);
		var basestring = '<div class="addbox">Add an item:&nbsp;&nbsp;&nbsp;<select name="tempbox" class="addcombo" id="select_' + thisid + '"></select> <input type="button" class="additem" value="&nbsp;&nbsp;+&nbsp;&nbsp;"/></div>';
		$("#box_" + thisid).append(basestring);
		tar_mselect.addoptions(thisid);
	},
	addoptions : function(thisid) {
		optionstring = "";
		optioncount = 0;
		$("#" + thisid).children().each(function(){
			if (!($(this).attr("selected"))) {
				optionstring = optionstring + '<option rel="' + optioncount + '">' + $(this).html() + '</option>';
			}
			optioncount++;
		});
		$("#select_" + thisid).empty().append('<option rel="x">Choose an option to add to the list...</option>' + optionstring);
		tar_mselect.eventsetup();
	},
	build : function(elem) {
		var thisid = "box_" + $(elem).attr("id");
		var isimg = ($(elem).hasClass("imglist")) ? " imglist" : "";
		$(elem).hide();
		$(elem).before('<div class="superselectbox' + isimg + '" id="' + thisid + '"></div>');
		tar_mselect.addboxes(elem,thisid);
	},
	addboxes : function(elem,thisid,indi) {
		$("#" + thisid).empty();
		thislist = $(elem).children(":selected");
		for (i=0;i<thislist.length;i++) {
			thisindex = $(thislist[i]).parent().children().index($(thislist[i]));
			$("#" + thisid).append(tar_mselect.structure($(thislist[i]).html(),thisindex));
		}
		$("#" + thisid).append('<div class="clearfloat"></div>');
		tar_mselect.addboxstring(thisid);
		tar_mselect.eventsetup();
	},
	structure : function(val,rel) {
		return '<div class="supertag" rel="' + rel + '"><span class="supertagval">' + val + '</span><span class="supertagbutton remove" title="Remove this entry."></span></div>';
	},
	eventsetup : function() {
		$(".superselectbox .supertagbutton").unbind("click").click(function(){
			if ($(this).hasClass("remove")) {
				tar_mselect.startremove($(this).parent());
			}
		});
		$(".superselectbox .additem").unbind("click").click(function(){ tar_mselect.additem($(this).parent().parent()); });
		$(".superselectbox .addcombo").unbind("keydown").bind("keydown",function(e){
			if (e.keyCode == 13) {
				$(this).next().click();
				return false;
			}
		});
		$(".superselectbox.imglist .addcombo").unbind("keyup").bind("keyup",function(e){
			tar_mselect.imgpreview(this,"key");
		});
		$(".superselectbox.imglist .addcombo option").unbind("mouseenter").bind("mouseenter",function(){ tar_mselect.imgpreview(this,"hover"); }) 
	},
	startremove : function(elem) {
		$(elem).hide(400,function(){ tar_mselect.killnode(this,$(this).parent()); });
	},
	killnode : function(elem,parent) {
		thisindex = $(elem).attr("rel"); 
		$(elem).remove();
		tar_mselect.selectio($(parent).attr("id").substr(4),thisindex,"remove");
		tar_mselect.addoptions($(parent).attr("id").substr(4));
	},
	selectio : function(thisid,thisindex,mode) {
		statechange = (mode == "add") ? true : false;
		$("#" + thisid).children(":eq(" + thisindex + ")").attr("selected",statechange);
	},
	additem : function(elem) {
		addrel = $(elem).find(".addcombo").children(":selected").attr("rel");
		$("#imglistpreview").remove();
		if (addrel != "x") {
			addtext = $(elem).find(".addcombo").children(":selected").text();
			addtext = ($(elem).hasClass("imglist")) ? '<img src="' + $("#" + $(elem).attr("id").substr(4)).next(".img_path").attr("rel") + addtext + '"/>' + addtext : addtext ;
			$(elem).find(".addcombo").children(":selected").remove();
			$(elem).children(".clearfloat").before(tar_mselect.structure(addtext,addrel));
			tar_mselect.selectio($(elem).attr("id").substr(4),addrel,"add");
			$(elem).find(".addtext").val("");
			tar_mselect.eventsetup();
		}
	},
	renamebuttons : function(elem,direc) {
		if (direc == "toedit") {
			editbutton = "Confirm this change.";
			removebutton = "Canced this change.";
		} else {
			editbutton = "Edit this entry.";
			removebutton = "Remove this entry.";
		}
		$(elem).children(".supertagbutton.edit").attr("title",editbutton);
		$(elem).children(".supertagbutton.remove").attr("title",removebutton);
	},
	imgpreview : function(elem,act) {
		getrel = (act == "hover") ? $(elem).attr("rel") : $(elem).children(":selected").attr("rel");
		if (getrel != "x") {
			getimg = (act == "hover") ? $(elem).text() : $(elem).children(":selected").text();
			thisid = (act == "hover") ? $(elem).parent().attr("id").substr(7) : $(elem).attr("id").substr(7);
			getpath = $("#" + thisid).next(".img_path").attr("rel");
			$("#imglistpreview").remove();
			$("#box_" + thisid).find(".addbox").append('<div id="imglistpreview"><img src="' + getpath + getimg + '"/></div>');
		} else {
			$("#imglistpreview").remove();
		}
	}
}

tar_mtag = {
	addboxstring : '<div class="addbox">Add an item:&nbsp;&nbsp;&nbsp;<input type="text" class="addtext" value=""/> <input type="button" class="additem" value="&nbsp;&nbsp;+&nbsp;&nbsp;"/></div>',
	init : function() {
		$(".mtag").each(function(){
			tar_mtag.build(this);
		});
		tar_mtag.eventsetup();
	},
	build : function(elem) {
		var thisid = "box_" + $(elem).attr("id");
		listtype = ($(elem).hasClass("list")) ? "bulletlist" : "taglist"; 
		$(elem).change(function(){ tar_mtag.addboxes(this,"box_" + this.id,true) }).hide();
		$(elem).before('<div class="supertagbox ' + listtype + '" id="' + thisid + '"></div>');
		tar_mtag.addboxes(elem,thisid);
	},
	addboxes : function(elem,thisid,indi) {
		$("#" + thisid).empty();
		thislist = $(elem).val().split(";");
		for (i=0;i<thislist.length;i++) {
			if ($.trim(thislist[i]) != "") {
				$("#" + thisid).append(tar_mtag.structure(thislist[i]));
			}
		}
		$("#" + thisid).append('<div class="clearfloat"></div>');
		$("#" + thisid).append(tar_mtag.addboxstring);
		tar_mtag.addrels($("#" + thisid));
		if (indi) {
			tar_mtag.eventsetup();
		}
	},
	addrels : function(elem) {
		var childnum = $(elem).children(".supertag").length;
		for (i=0;i<childnum;i++) {
			$(elem).children(".supertag:eq(" + i + ")").attr("rel",i);
		}
	},
	structure : function(val) {
		val = val.replace("<","&lt;");
		return '<div class="supertag"><span class="supertagval">' + $.trim(val) + '</span><span class="supertagbutton edit" title="Edit this entry."></span><span class="supertagbutton remove" title="Remove this entry."></span></div>';
	},
	eventsetup : function() {
		$(".supertagbox .supertagbutton").unbind("click").click(function(){
			if ($(this).parent().hasClass("editing")) {
				if ($(this).hasClass("edit")) {
					tar_mtag.finishedit($(this).parent(),"finish");
				} else if ($(this).hasClass("remove")) {
					tar_mtag.finishedit($(this).parent(),"cancel");
				}
			} else {
				if ($(this).hasClass("edit")) {
					tar_mtag.startedit($(this).parent());
				} else if ($(this).hasClass("remove")) {
					tar_mtag.startremove($(this).parent());
				}
			}
		});
		$(".supertagbox .additem").unbind("click").click(function(){ tar_mtag.additem($(this).parent().parent()); });
		$(".supertagbox .addtext").unbind("keydown").bind("keydown",function(e){
			if (e.keyCode == 13) {
				$(this).next().click();
				return false;
			}
		}); 
	},
	startedit : function(elem) {
		if ($("#editingbox").length > 0) {
			tar_mtag.finishedit($("#editingbox").parent().parent(),"cancel");
		}
		curwidth = parseInt($(elem).css("width")) - 55;
		$(elem).addClass("editing");
		tar_mtag.renamebuttons(elem,"toedit");
		gettext = $(elem).children(".supertagval").html();
		$(elem).children(".supertagval").attr("rel",gettext);
		inclass = $(elem).parent().hasClass("bulletlist");
		if (gettext.length > 128 || inclass) {
			$(elem).children(".supertagval").html('<span id="editingbox"><textarea id="newval" style="width:' + (curwidth+5) + 'px">' + gettext + '</textarea></span>');
		} else {
			$(elem).children(".supertagval").html('<span id="editingbox"><input id="newval" type="text" value="' + gettext + '" style="width:' + curwidth + 'px"/></span>');
		}
		$("#newval").unbind("keydown").bind('keydown',function(e){
			if (e.keyCode == 13) {
				$(this).parent().parent().next().click();
				return false;
			}
		});
		$("#editingbox").children("input").focus();
	},
	finishedit : function(elem,action) {
		if ($.trim($("#editingbox").children("#newval").val()) != "") {
			$(elem).removeClass("editing").removeAttr("style");
			tar_mtag.renamebuttons(elem,"unedit");
			newtext = (action == "finish") ? $("#editingbox").children("#newval").val() : $(elem).children(".supertagval").attr("rel");
			tar_mtag.boxio($(elem).attr("rel"),"#"+$(elem).parent().attr("id").substr(4),newtext);
			$(elem).children(".supertagval").html(newtext);
			$("#editingbox").remove();
		} else {
			tar_mtag.startremove(elem);
		}
	},
	startremove : function(elem) {
		$(elem).hide(400,function(){ tar_mtag.killnode(this,$(this).parent()); });
	},
	killnode : function(elem,parent) {
		thisindex = $(elem).attr("rel"); 
		$(elem).remove();
		tar_mtag.boxio(thisindex,"#"+$(parent).attr("id").substr(4),"");
		tar_mtag.addrels($(parent));
	},
	boxio : function(thisindex,getid,newstring,mode) {
		rawval = $(getid).val();
		if (rawval.charAt(rawval.length-1) != ";") {
			rawval = rawval + ";";
		}
		curval = rawval.split(";");
		if (thisindex != "add") {
			curval.splice(thisindex,1,newstring);
		} else {
			curval.splice(curval.length-1,1,newstring);
		}
		newstring = "";
		for (i=0;i<curval.length;i++) {
			if ($.trim(curval[i]) != "") {
				newstring += $.trim(curval[i]) + ";";
			}
		}
		$(getid).val(newstring);
	},
	additem : function(elem) {
		addrel = parseInt($(elem).children(".supertag").length);
		addtext = $(elem).find(".addtext").val().split(";");
		addtextstring = "";
		for (i=0;i<addtext.length;i++) {
			if ($.trim(addtext[i]) != "") {
				$(elem).children(".clearfloat").before(tar_mtag.structure(addtext[i]));
				addtextstring+=addtext[i]+";";
			}
		}
		tar_mtag.boxio("add","#"+$(elem).attr("id").substr(4),addtextstring.substr(0,addtextstring.length-1));
		$(elem).find(".addtext").val("");
		tar_mtag.eventsetup();
		tar_mtag.addrels(elem);
	},
	renamebuttons : function(elem,direc) {
		if (direc == "toedit") {
			editbutton = "Confirm this change.";
			removebutton = "Canced this change.";
		} else {
			editbutton = "Edit this entry.";
			removebutton = "Remove this entry.";
		}
		$(elem).children(".supertagbutton.edit").attr("title",editbutton);
		$(elem).children(".supertagbutton.remove").attr("title",removebutton);
	}
}
