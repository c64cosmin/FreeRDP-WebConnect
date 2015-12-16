var LoginMenu = function(){
    this.elem = document.createElement("div");
    document.body.appendChild(this.elem);
    this.elem.id = "loginmenu";
    this.heightTarget = 1;
    this.height = 0;
    this.width = 0.15;
    this.xTarget = 0;
    this.x = 0;
    this.y = window.innerHeight*(1.0 - this.height)*0.5;
    this.buttonHeight = 30;
    this.logoHeight = 80;
    this.state = "center";
    this.elem.style["position"] = "absolute";
    this.elem.style["width"] = window.innerWidth * this.width + "px";
    this.elem.style["height"] = window.innerHeight * this.height + "px";
    this.elem.style["left"] = this.x + "px";
    this.elem.style["top"] = this.y + "px";
    this.elem.style["overflow"] = "hidden";
    this.logo = new Logo(this.elem, this.logoHeight);
    this.entries = [];
    this.entries.push(new TextEntry(this.elem, "test0", "Woot"));
    this.entries.push(new TextEntry(this.elem, "test1", "Woot"));
    this.update = function(){
        if(this.state == "center"){
            this.heightTarget = (this.logoHeight + this.entries.length * this.buttonHeight) / window.innerHeight;
            this.xTarget = window.innerWidth * (1-this.width) * 0.5;
        }
        if(this.state == "left"){
            this.heightTarget = 1;
            this.xTarget = 0;
        }
        if(this.state == "right"){
            this.heightTarget = 1;
            this.xTarget = window.innerWidth * (1-this.width);
        }
        this.height += (this.heightTarget - this.height)*0.1;
        this.x += (this.xTarget - this.x)*0.1;
        this.y = window.innerHeight*(1.0 - this.height)*0.5;
        this.elem.style["width"] = window.innerWidth * this.width + "px";
        this.elem.style["height"] = window.innerHeight * this.height + "px";
        this.elem.style["left"] = this.x + "px";
        this.elem.style["top"] = this.y + "px";
        for(var i=0;i<this.entries.length;i++){
            this.entries[i].update(this.buttonHeight);
        }
    }
}

var Logo = function(parent, height){
    this.elem = document.createElement("div");
    parent.appendChild(this.elem);
    this.elem.style["position"] = "relative";
    this.elem.style["width"] = "100%";
    this.elem.style["height"] = height + "px";
    this.elem.style["background-image"] = "url('http://cloudbase.it/wp-content/uploads/2012/10/CBSL_web_logo3.png')";
    this.elem.style["background-size"] = "contain";
    this.elem.style["background-repeat"] = "no-repeat";
}

var TextEntry = function(parent, id, caption){
    this.elem = document.createElement("div");
    parent.appendChild(this.elem);
    this.id = id;
    this.height = 0;
    this.caption = caption;
    this.elem.style["position"] = "relative";
    this.elem.style["width"] = "100%";
    this.elem.style["height"] = "0px";
    this.elem.style["margin-bottom"] = "1px";
    this.elem.style["overflow"] = "hidden";
    this.elem.className = "textentry";
    this.update = function(pixelHeight){
        this.height += (pixelHeight - 1 - this.height)*0.1;
        this.elem.style["height"] = this.height + "px";
    }
    this.createCaption = function(){
        this.captionElem = document.createElement("div");
        this.elem.appendChild(this.captionElem);
        this.captionElem.style["position"] = "relative";
        this.captionElem.style["width"] = "25%";
        this.captionElem.style["height"] = "100%";
        this.captionElem.style["display"] = "table";
        this.captionElem.style["float"] = "left";
        this.captionElem.innerHTML = "<p class='textareacaption' style='display:table-cell;vertical-align:middle;text-align:center'>" + this.caption + "</p>";
    }
    this.createTextArea = function(){
        this.textAreaElem = document.createElement("div");
        this.elem.appendChild(this.textAreaElem);
        this.textAreaElem.style["position"] = "relative";
        this.textAreaElem.style["position"] = "relative";
        this.textAreaElem.style["width"] = "75%";
        this.textAreaElem.style["height"] = "100%";
        this.textAreaElem.style["float"] = "right";
        this.textAreaElem.innerHTML = "<input id='" + this.id + "' style='width:100%;height:100%;resize:none;margin:1px;float:right;'></input>";
    }
    this.createCaption();
    this.createTextArea();
}
