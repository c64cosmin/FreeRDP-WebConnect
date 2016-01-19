var LoginMenu = function(){
    this.elem = document.createElement("div");
    document.body.appendChild(this.elem);
    this.elem.id = "loginmenu";
    this.heightTarget = 1;
    this.height = 0;
    this.width = 300;
    this.xTarget = 0;
    this.x = 0;
    this.y = 0;
    this.counter = 0;
    this.state = "center";
    this.elem.style["position"] = "absolute";
    this.elem.style["width"] = window.innerWidth * this.width + "px";
    this.elem.style["height"] = window.innerHeight * this.height + "px";
    this.elem.style["left"] = this.x + "px";
    this.elem.style["top"] = this.y + "px";
    this.elem.style["overflow"] = "hidden";
    this.elem.style["z-index"] = 10;
    this.logo = new Logo(this.elem, this.logoHeight);
    this.menu1 = new Group();
    this.menu1.push(new Button(this.elem, "button", "RDP session parameters", 20));
    this.menu1.push(new TextEntry(this.elem, "rdphost", "Hostname"));
    this.menu1.push(new TextEntry(this.elem, "rdpuser", "User"));
    this.menu1.push(new TextEntry(this.elem, "rdppass", "Password", true));
    this.menu2 = new Group();
    options = {0:"LAN",
               1:"Broadband",
               2:"Modem"};
    this.menu2.push(new MultiSelection(this.elem, "perf", "Performance", options));
    this.menu2.push(new TextEntry(this.elem, "rdpport", "Port"));
    this.menu2.push(new TextEntry(this.elem, "rdppcb", "PCB (vmID)"));
    this.menu2.push(new CheckButton(this.elem, "nonla", "disable NLA"));
    this.menu2.push(new CheckButton(this.elem, "notls", "disable TLS"));
    options = {0:"disabled",
               1:"NTLM v1",
               2:"NTLM v2"};
    this.menu2.push(new MultiSelection(this.elem, "fntlm", "Force NTLM auth", options));
    this.menu2.hide();
    //helper buttons
    this.menu3 = new Group();
    this.menu3.push(new Button(this.elem, "ctrlaltdelete", "Ctrl+Alt+Del", 30));
    this.menu3.push(new Button(this.elem, "alttab", "Alt+Tab", 30));
    this.menu3.push(new Button(this.elem, "keyboardlanguage", "Multilanguage keyboard", 30));
    this.menu3.hide();
    //add connect button
    this.connect = new Button(this.elem, "rdpconnect", "Connect", 30);
    //add the advanced button, show the advanced menu and hide the button
    var advancedButton = new Button(this.elem, "advanced", "Advanced", 20);
    var menu2 = this.menu2;
    this.menu1.push(advancedButton);
    advancedButton.setCallback(function(){
        if(menu2.state == "hide")
            menu2.show();
        else
            menu2.hide();
    });

    this.update = function(){
        if(this.state == "center"){
            //we add 1px for the bottom margin
            this.heightTarget = (this.logo.height + this.menu1.height + this.menu2.height + this.menu3.height + this.connect.height + 1) / window.innerHeight;
            this.xTarget = (window.innerWidth - this.width) * 0.5;
            this.counter = 0;
        }
        if(this.state == "left"){
            this.heightTarget = 1;
            this.xTarget = 0;
            this.counter++;
            if(this.counter==200){
                this.state="hideleft";
                this.counter=0;
            }
        }
        if(this.state == "right"){
            this.heightTarget = 1;
            this.xTarget = (window.innerWidth - this.width);
        }
        if(this.state == "hideleft"){
            this.heightTarget = 1;
            this.xTarget = -this.width;
            if(mouseX < 1){
                this.counter++;
            }
            if(this.counter > 60){
                this.state = "left";
                this.counter = 0;
            }
        }
        this.height += (this.heightTarget - this.height)*0.2;
        this.x += (this.xTarget - this.x)*0.1;
        this.y = window.innerHeight*(1.0 - this.height)*0.5;
        this.elem.style["width"] = this.width + "px";
        this.elem.style["height"] = window.innerHeight * this.height + "px";
        this.elem.style["left"] = this.x + "px";
        this.elem.style["top"] = this.y + "px";
        this.menu1.update();
        this.menu2.update();
        this.menu3.update();
        this.connect.update();
    }
}

var Group = function(){
    this.elements = [];
    this.height = 0;
    this.state = "hide";
    this.update = function(){
        this.height = 0;
        for(var i=0;i<this.elements.length;i++){
            this.elements[i].update();
            this.height += this.elements[i].height;
        }
    }
    this.show = function(){
        this.state = "show";
        for(var i=0;i<this.elements.length;i++){
            this.elements[i].show();
        }
    }
    this.hide = function(){
        this.state = "hide";
        for(var i=0;i<this.elements.length;i++){
            this.elements[i].hide();
        }
    }
    this.push = function(elem){
        this.elements.push(elem);
    }
}

var Button = function(parent, id, caption, height){
    this.elem = document.createElement("div");
    parent.appendChild(this.elem);
    this.id = id;
    this.heightExpanded = height;
    this.heightTarget = this.heightExpanded;
    this.height = 0;
    this.caption = caption;
    this.elem.style["position"] = "relative";
    this.elem.style["width"] = "100%";
    this.elem.style["height"] = "0px";
    this.elem.style["overflow"] = "hidden";
    this.elem.style["cursor"] = "pointer";
    this.elem.className = "button";
    this.createCaption = function(){
        this.captionElem = document.createElement("div");
        this.elem.appendChild(this.captionElem);
        this.captionElem.style["position"] = "relative";
        this.captionElem.style["width"] = "100%";
        this.captionElem.style["height"] = "100%";
        this.captionElem.style["display"] = "table";
        this.captionElem.style["float"] = "left";
        this.captionElem.innerHTML = "<p class='textareacaption' id='" + this.id + "' style='display:table-cell;vertical-align:middle;text-align:center'>" + this.caption + "</p>";
    }
    this.createCaption();
    this.update = function(){
        //we need an extra pixel so the element has a bottom edge of 2px height
        this.height += ((this.heightTarget + 2) - this.height)*0.1;
        this.elem.style["height"] = this.height + "px";
    }
    this.show = function(){
        this.heightTarget = this.heightExpanded;
    }
    this.hide = function(){
        this.heightTarget = -2;
    }
    this.setCallback = function(callback){
        this.callback = callback
        this.elem.addEventListener("click", callback); 
    }
}

var Logo = function(parent){
    this.elem = document.createElement("div");
    parent.appendChild(this.elem);
    this.height = 80;
    this.elem.style["position"] = "relative";
    this.elem.style["width"] = "100%";
    this.elem.style["height"] = this.height + "px";
    this.elem.style["background-image"] = "url('http://cloudbase.it/wp-content/uploads/2012/10/CBSL_web_logo3.png')";
    this.elem.style["background-size"] = "contain";
    this.elem.style["background-repeat"] = "no-repeat";
}
var TextEntry = function(parent, id, caption, isPassword){
    this.elem = document.createElement("div");
    parent.appendChild(this.elem);
    this.id = id;
    this.heightExpanded = 30;
    this.heightTarget = this.heightExpanded;
    this.height = 0;
    this.caption = caption;
    this.elem.style["position"] = "relative";
    this.elem.style["width"] = "100%";
    this.elem.style["height"] = "0px";
    this.elem.style["overflow"] = "hidden";
    this.elem.className = "textentry";
    this.update = function(){
        //we need an extra pixel so the element has a bottom edge of 2px height
        this.height += ((this.heightTarget + 2) - this.height)*0.1;
        this.elem.style["height"] = this.height + "px";
    }
    this.show = function(){
        this.heightTarget = this.heightExpanded;
    }
    this.hide = function(){
        this.heightTarget = -2;
    }
    this.createCaption = function(){
        this.captionElem = document.createElement("div");
        this.elem.appendChild(this.captionElem);
        this.captionElem.style["position"] = "relative";
        this.captionElem.style["width"] = "30%";
        this.captionElem.style["height"] = "100%";
        this.captionElem.style["display"] = "table";
        this.captionElem.style["float"] = "left";
        this.captionElem.innerHTML = "<p class='textareacaption' style='display:table-cell;vertical-align:middle;text-align:center'>" + this.caption + "</p>";
    }
    this.createCaption();
    this.createTextArea = function(isPass){
        this.textAreaElem = document.createElement("div");
        this.elem.appendChild(this.textAreaElem);
        this.textAreaElem.style["position"] = "relative";
        this.textAreaElem.style["width"] = "70%";
        this.textAreaElem.style["height"] = "100%";
        this.textAreaElem.style["float"] = "right";
        this.textAreaElem.innerHTML = "<input id='" + this.id + "' type='" + (isPass==true?"password":"text") + "' style='width:100%;height:100%;resize:none;margin:1px;float:right;'></input>";
    }
    this.createTextArea(isPassword);
}

var CheckButton = function(parent, id, caption){
    this.elem = document.createElement("div");
    parent.appendChild(this.elem);
    this.id = id;
    this.heightExpanded = 30;
    this.heightTarget = this.heightExpanded;
    this.height = 0;
    this.caption = caption;
    this.elem.style["position"] = "relative";
    this.elem.style["width"] = "100%";
    this.elem.style["height"] = "0px";
    this.elem.style["overflow"] = "hidden";
    this.elem.classname = "checkbutton";
    this.update = function(){
        //we need an extra pixel so the element has a bottom edge of 2px height
        this.height += ((this.heightTarget + 2) - this.height)*0.1;
        this.elem.style["height"] = this.height + "px";
        this.checkAreaElem.style["width"] = (this.height - 1) + "px";
        this.checkAreaElem.style["height"] = (this.height - 1)  + "px";
    }
    this.show = function(){
        this.heightTarget = this.heightExpanded;
    }
    this.hide = function(){
        this.heightTarget = -2;
    }
    this.createCaption = function(){
        this.captionElem = document.createElement("div");
        this.elem.appendChild(this.captionElem);
        this.captionElem.style["position"] = "relative";
        this.captionElem.style["width"] = "50%";
        this.captionElem.style["height"] = "100%";
        this.captionElem.style["display"] = "table";
        this.captionElem.style["float"] = "left";
        this.captionElem.innerHTML = "<p class='textareacaption' style='display:table-cell;vertical-align:middle;text-align:center'>" + this.caption + "</p>";
    }
    this.createCaption();
    this.createCheckBox = function(){
        this.checkAreaElem = document.createElement("div");
        this.elem.appendChild(this.checkAreaElem);
        this.checkAreaElem.style["position"] = "relative";
        this.checkAreaElem.style["margin-top"] = "1px";
        this.checkAreaElem.style["margin-right"] = "1px";
        this.checkAreaElem.style["float"] = "right";
        this.checkAreaElem.innerHTML = "<input id='" + this.id + "' type='checkbox' style='width:100%;height:100%;resize:none;float:right;'></input>";
    }
    this.createCheckBox();
}
var MultiSelection = function(parent, id, caption, options){
    this.elem = document.createElement("div");
    parent.appendChild(this.elem);
    this.id = id;
    this.heightExpanded = 30;
    this.heightTarget = this.heightExpanded;
    this.height = 0;
    this.caption = caption;
    this.elem.style["position"] = "relative";
    this.elem.style["width"] = "100%";
    this.elem.style["height"] = "0px";
    this.elem.style["overflow"] = "hidden";
    this.elem.classname = "multiselection";
    this.update = function(){
        //we need an extra pixel so the element has a bottom edge of 2px height
        this.height += ((this.heightTarget + 2) - this.height)*0.1;
        this.elem.style["height"] = this.height + "px";
        this.multiAreaElem.style["height"] = this.height + "px";
    }
    this.show = function(){
        this.heightTarget = this.heightExpanded;
    }
    this.hide = function(){
        this.heightTarget = -2;
    }
    this.createCaption = function(){
        this.captionElem = document.createElement("div");
        this.elem.appendChild(this.captionElem);
        this.captionElem.style["position"] = "relative";
        this.captionElem.style["width"] = "50%";
        this.captionElem.style["height"] = "100%";
        this.captionElem.style["display"] = "table";
        this.captionElem.style["float"] = "left";
        this.captionElem.innerHTML = "<p class='textareacaption' style='display:table-cell;vertical-align:middle;text-align:center'>" + this.caption + "</p>";
    }
    this.createCaption();
    this.createMultiSelection = function(options){
        this.multiAreaElem = document.createElement("div");
        this.elem.appendChild(this.multiAreaElem);
        this.multiAreaElem.style["position"] = "relative";
        this.multiAreaElem.style["float"] = "right";
        this.multiAreaElem.style["width"] = "50%";
        html = "<select id='" + this.id + "' style='height:100%;width:100%;margin-top:1px;margin-right:1px;float:right;'>";
        for(var option in options){
            html += "<option value='" + option + "'>" + options[option] + "</option>";
        }
        html += "</select>";
        this.multiAreaElem.innerHTML = html;
    }
    this.createMultiSelection(options);
}
