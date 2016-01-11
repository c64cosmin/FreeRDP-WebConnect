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
    this.state = "center";
    this.elem.style["position"] = "absolute";
    this.elem.style["width"] = window.innerWidth * this.width + "px";
    this.elem.style["height"] = window.innerHeight * this.height + "px";
    this.elem.style["left"] = this.x + "px";
    this.elem.style["top"] = this.y + "px";
    this.elem.style["overflow"] = "hidden";
    this.logo = new Logo(this.elem, this.logoHeight);
    this.menu1 = new Group();
    this.menu1.push(new Button(this.elem, "RDP session parameters", function(){}, 20));
    this.menu1.push(new TextEntry(this.elem, "test", "Hostname"));
    this.menu1.push(new TextEntry(this.elem, "test", "User"));
    this.menu1.push(new TextEntry(this.elem, "test", "Password"));
    var menu2 = this.menu2 = new Group();
    this.menu2.push(new TextEntry(this.elem, "test", "Port"));
    this.menu2.push(new TextEntry(this.elem, "test", "PCB (vmID)"));
    this.menu2.hide();
    this.connect = new Button(this.elem, "Connect", function(){}, 30);
    //add the advanced button, show the advanced menu and hide the button
    this.menu1.push(new Button(this.elem, "Advanced", function(){menu2.show();this.hide();}, 20));

    this.update = function(){
        if(this.state == "center"){
            //we add 1px for the bottom margin
            this.heightTarget = (this.logo.height + this.menu1.height + this.menu2.height + this.connect.height + 1) / window.innerHeight;
            this.xTarget = (window.innerWidth - this.width) * 0.5;
        }
        if(this.state == "left"){
            this.heightTarget = 1;
            this.xTarget = 0;
        }
        if(this.state == "right"){
            this.heightTarget = 1;
            this.xTarget = (window.innerWidth - this.width);
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
        for(var i=0;i<this.elements.length;i++){
            this.elements[i].show();
        }
    }
    this.hide = function(){
        for(var i=0;i<this.elements.length;i++){
            this.elements[i].hide();
        }
    }
    this.push = function(elem){
        this.elements.push(elem);
    }
}

var Button = function(parent, caption, callback, height){
    this.elem = document.createElement("div");
    parent.appendChild(this.elem);
    this.heightExpanded = height;
    this.heightTarget = this.heightExpanded;
    this.height = 0;
    this.caption = caption;
    this.callback = callback;
    this.elem.style["position"] = "relative";
    this.elem.style["width"] = "100%";
    this.elem.style["height"] = "0px";
    this.elem.style["overflow"] = "hidden";
    this.elem.style["display"] = "table";
    this.elem.style["cursor"] = "pointer";
    this.elem.className = "button";
    this.elem.innerHTML = "<p class='textareacaption' style='display:table-cell;vertical-align:middle;text-align:center'>" + this.caption + "</p>";
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
    this.click = function(){
        if(this.state == "inflate"){
            this.state = "deflate";
            this.group.hide();
        }
        else{
            this.state = "inflate";
            this.group.show();
        }
    }
    var s = this;
    this.elem.addEventListener("click", function(){s.callback();}); 
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
var TextEntry = function(parent, id, caption){
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
    this.createTextArea = function(){
        this.textAreaElem = document.createElement("div");
        this.elem.appendChild(this.textAreaElem);
        this.textAreaElem.style["position"] = "relative";
        this.textAreaElem.style["position"] = "relative";
        this.textAreaElem.style["width"] = "70%";
        this.textAreaElem.style["height"] = "100%";
        this.textAreaElem.style["float"] = "right";
        this.textAreaElem.innerHTML = "<input id='" + this.id + "' style='width:100%;height:100%;resize:none;margin:1px;float:right;'></input>";
    }
    this.createTextArea();
}
