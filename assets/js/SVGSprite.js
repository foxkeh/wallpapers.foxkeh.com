/** 
 * @fileOverview SVG要素 を Flash/Flex の Sprite っぽく扱うためのライブラリ
 * 
 * @author OFFIBA.com
 * @version 20090919
 *
 */

/** 
 * @class SVGSpriteはSVGエレメントをFlash/FlexのSpriteライクに扱うためのライブラリです。<br />
 * SVGSpriteの各種クラスを含んでいます。<br />
 * 対応している html+svg　複合文書形式は、CDR(object要素)および、CDIです。
 * 
 */
var SVGSprite = {};

/**
 * EventListener をラッパーするターゲットを設定する
 * 
 * @class SVGSprite.EventDispatcher はイベント送出用基本クラスです。<br />
 * SVGエレメントの EventListener にラッパーするためのクラスです。
 * 
 * @param {String} svgElement	ラッパー先のSVGElementかもしくはid
 */
SVGSprite.EventDispatcher = function() {
    if (0===0) { //Bugfix for Firefox 9 https://bugzilla.mozilla.org/show_bug.cgi?id=706808		
	/**
	* 内部保持用　SVGElement
	* @return {SVGElement}
	*/
	this.svgElement;
    }
}


/**
  * イベントリスナーに登録する<br />
  * SVGエレメントの addEventListener に橋渡しする。
  * 
  * @param {String}	type イベントタイプ
  * @param {Function} listener リスナーファンクション
  * @param {Boolean} useCapture ユーズキャプチャー
  * @return {Void}
  * 
  */
SVGSprite.EventDispatcher.prototype.addEventListener = function(type, listener, useCapture){

	useCapture = (useCapture)? true : false;
	this.svgElement.addEventListener(type, listener, useCapture);
	
}


/**
  * イベントリスナーから削除する<br />
  * SVGエレメントの removeEventListener に橋渡しする。
  * 
  * @param {String}	type イベントタイプ
  * @param {Function} listener リスナーファンクション
  * @param {Boolean} useCapture ユーズキャプチャー
  * @return {Void}
  * 
  */
SVGSprite.EventDispatcher.prototype.removeEventListener = function(type, listener, useCapture){

	useCapture = (useCapture)? true : false;
	this.svgElement.removeEventListener(type, listener, useCapture);
	
}




 
/**
 * SVGSprite.DisplayObject を初期化する
 * 
 * @class SVGSprite.DisplayObject は表示することのできるオブジェクトの基本クラスです。<br />
 * SVGエレメントを移動、拡大縮小、回転、透過させることができます。
 * 
 * @return {Void}
 *
 * @example
 * var monkey = new SVGSprite.DisplayObject('monkey'); //引数にはSVGエレメントのidを指定<br />
 * monkey.x = 100;				//x座標の100pxに移動<br />
 * monkey.rotation = 90;	//90度回転<br />
 * monkey.scaleY = 1.5;		//y方向に1.5倍拡大<br />
 * monkey.alpha = .2;			//透明度を.2に設定
 */
SVGSprite.DisplayObject = function(svgElement) {
    if (0===0) { //Bugfix for Firefox 9 https://bugzilla.mozilla.org/show_bug.cgi?id=706808
	this.svgElement = svgElement;
    }
}

SVGSprite.DisplayObject.prototype = new SVGSprite.EventDispatcher();

/**
  * prefixゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("_prefix", function() {
	
	return this.__prefix;
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("_prefix", function(width) {
	
	throw new Error("参照専用です。");
	
});


/**
  * svgElement ゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("svgElement", function() {
	
	return this._svgElement;
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("svgElement", function(svgElement) {
	
	if(typeof this._svgElement === "undefined" && svgElement){
		
		//_svgElement設定
		var _svgElement = svgElement;
		
		if (typeof svgElement === "string") {
		
			var __svgElement = document.getElementById(svgElement);
			
			if(__svgElement) {
				
				_svgElement = __svgElement;
				
			} else {
				
				var _SVGs = document.getElementsByTagName('object');
				
				for(var i=0; i<_SVGs.length; i++) {
						
						if(_SVGs[i].type === "image/svg+xml") {
								
								_svgElement = _SVGs[i].contentDocument.getElementById(svgElement);
								
						}
						
				}
				
			}
			 
			 
		}
		
		if(! _svgElement || _svgElement.namespaceURI !== "http://www.w3.org/2000/svg") {

			throw new Error("引数が SVG Element ではありません。");

		}
		
		//_prefix設定
		this.__prefix = (typeof _svgElement.prefix === "string")? _svgElement.prefix+":" : "";
		
		//svgElement設定
		this._init(_svgElement);
		
		//svgElement側からSVGSpriteを参照でるように結びつける
		var _self = this;
		//this._svgElement.setUserData('linkage', this, null);
		this._svgElement.linkage = this;
		
	}
	
	
});

/**
  * prefixゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("_prefix", function() {
	
	return this.__prefix;
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("_prefix", function(width) {
	
	throw new Error("参照専用です。");
	
});

/**
  * viewPortとviewBoxのX座標比を返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getViewPortScaleX = function(){
	
	/*
	var viewportElementWidth = this._svgElement.nearestViewportElement.getBBox().width;
	var ownerSVGElemenWidth = (this._svgElement.ownerSVGElement.width.baseVal.valueAsString == "100%")? this._svgElement.ownerSVGElement.parentNode.getBoundingClientRect().width : this._svgElement.ownerSVGElement.width.baseVal.value;
	
	return ownerSVGElemenWidth/viewportElementWidth;
	*/

	//return this._svgElement.nearestViewportElement.getClientRects().item(0).width/this._svgElement.nearestViewportElement.getBBox().width;	
	return this._svgElement.nearestViewportElement.width.baseVal.value/this._svgElement.nearestViewportElement.viewBox.baseVal.width;

}

/**
  * _viewPortScaleX ゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("_viewPortScaleX", function() {
	
	return this._getViewPortScaleX();
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("_viewPortScaleX", function(width) {
	
	throw new Error("参照専用です。");
	
});

/**
  * viewPortとviewBoxのY座標比を返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getViewPortScaleY = function(){
	
	/*
	var viewportElementHeight = this._svgElement.nearestViewportElement.getBBox().height;
	var ownerSVGElemenHeight = (this._svgElement.ownerSVGElement.height.baseVal.valueAsString == "100%")? this._svgElement.ownerSVGElement.parentNode.getBoundingClientRect().width : this._svgElement.ownerSVGElement.height.baseVal.value;
	
	return ownerSVGElemenHeight/viewportElementHeight;
	*/
	
	//return this._svgElement.nearestViewportElement.getClientRects().item(0).height/this._svgElement.nearestViewportElement.getBBox().height;	
	
	return this._svgElement.nearestViewportElement.height.baseVal.value/this._svgElement.nearestViewportElement.viewBox.baseVal.height;

}

/**
  * _viewPortScaleY ゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("_viewPortScaleY", function() {
	
	return this._getViewPortScaleY();
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("_viewPortScaleY", function(width) {
	
	throw new Error("参照専用です。");
	
});	
	
/**
  * Translateのx座標を返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getTranslateX = function() {
	//return this._translateTransform.matrix.e;
	return this._translateX;
}

/**
  * x座標を返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getX = function() {
	var x = this.svgElement.getBBox().x + this._getTranslateX();
	return (isNaN(x))? 0 : x;
}

/**
  * x座標ゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("x", function() {
	
	return this._getX();
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("x", function(x) {
	
	var _x = this._getTranslateX() + (x - this.x);
	//this._translateTransform.setTranslate(_x, this._getTranslateY());
	this._translateWrapper.setAttribute("transform", "translate("+_x+" "+this._getTranslateY()+") ");
	
	this._translateX = _x;
	
	//仮想中心点を設定
	this._cx = this._getCx();
	
});

/**
  * Translateのy座標を返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getTranslateY = function() {
	//return this._translateTransform.matrix.f;
	return this._translateY;
}

/**
  * y座標を返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getY = function() {
	var y = this.svgElement.getBBox().y + this._getTranslateY();
	return (isNaN(y))? 0 : y;

}

/**
  * y座標ゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("y", function() {
	
	return this._getY();
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("y", function(y) {
	
	var _y = this._getTranslateY() + (y - this.y);
	//this._translateTransform.setTranslate(this._getTranslateX(), _y);
	this._translateWrapper.setAttribute("transform", "translate("+this._getTranslateX()+" "+_y+") ");

	this._translateY = _y;
	
	//仮想中心点を設定
	this._cy = this._getCy();
	
});

/**
  * 幅を返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getWidth = function() {
	return this.svgElement.getBBox().width;	
}

/**
  * 幅ゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("width", function() {
	
	return this._getWidth();
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("width", function(width) {
	
	if(width !== 'INIT') throw new Error("参照専用です。");
	
});

/**
  * 高さを返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getHeight = function() {
	return this.svgElement.getBBox().height;	
}

/**
  * 高さゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("height", function() {
	
	return this._getHeight();
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("height", function(height) {
	
	if(height !== 'INIT') throw new Error("参照専用です。");
	
});

/**
  * xの拡大率を返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getScaleX = function() {
	//return this._scaleTransform.matrix.a;	
	return this._scaleX;
}

/**
  * scaleXゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("scaleX", function() {
	
	return this._getScaleX();
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("scaleX", function(scaleX) {
	
	//もとの位置
	var origX = this.x;
	var origW = this.width;
	
	//スケール変更
	//this._scaleTransform.setScale(scaleX, this.scaleY);
	this._scaleWrapper.setAttribute("transform", "scale("+scaleX+" "+this.scaleY+") rotate("+this._rotation+" "+this._cx+" "+this._cy+")");
	
	//位置調整
	this.x = origX + (origW - this.width)/2;
	
	this._scaleX = scaleX;
	
});

/**
  * yの拡大率を返す
  *
  * @return {Number}
  *
  */
SVGSprite.DisplayObject.prototype._getScaleY = function() {
	//return this._scaleTransform.matrix.d;	
	return this._scaleY;
}

/**
  * scaleYゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("scaleY", function() {
	
	return this._getScaleY();
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("scaleY", function(scaleY) {

	//もとの位置
	var origY = this.y;
	var origH = this.height;

	//スケール変更
	//this._scaleTransform.setScale(this.scaleX, scaleY);
	this._scaleWrapper.setAttribute("transform", "scale("+this.scaleX+" "+scaleY+") rotate("+this._rotation+" "+this._cx+" "+this._cy+")");

	//位置調整
	this.y = origY + (origH - this.height)/2;
	
	this._scaleY = scaleY;
	
});

/**
 * alpha値を返す
 *
 * @return {Number}
 *
 */
SVGSprite.DisplayObject.prototype._getAlpha = function() {
	
	var _alpha = this._alphaSVGElement.getAttribute('opacity');
	return  Number((typeof _alpha === 'string')? _alpha : 1);
}

/**
  * alphaゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("alpha", function() {
	
	return this._getAlpha();
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("alpha", function(alpha) {
	
	var _alpha = Number(alpha);
	if(0 <= _alpha && _alpha <= 1) {
		this._alphaSVGElement.setAttribute('opacity', _alpha);
	}
	
});

/**
  * xの仮想中心点を取得する
  * 
  * @return {Number}
  * 
  */
SVGSprite.DisplayObject.prototype._getCx = function() {
	
	return this.x + this.width/2;
	
}

/**
  * _cx ゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("_cx", function() {
	
	return this.__cx;
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("_cx", function(_cx) {
	
	if(typeof this.__cx !== 'number'){
		this.__cx = this._getCx();
	}
		
});

/**
  * yの仮想中心点を取得する
  * 
  * @return {Number}
  * 
  */
SVGSprite.DisplayObject.prototype._getCy = function() {
	
	return this.y + this.height/2;
	
}

/**
  * _cy ゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("_cy", function() {
	
	return this.__cy;
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("_cy", function(_cy) {

	if(typeof this.__cy !== 'number'){
		this.__cy = this._getCy();
	}

});


/**
  * rotation ゲッター／セッター
  *
  */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("rotation", function() {
	
	return this._rotation;
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("rotation", function(rotation) {
	
	this._rotation = Number(rotation);
	//this._rotationTransform.setRotate(this._rotation, this._cx, this._cy);
	this._scaleWrapper.setAttribute("transform", "scale("+this.scaleX+" "+this.scaleY+") rotate("+this._rotation+" "+this._cx+" "+this._cy+")");
	
});



/**
 * buttonMode ゲッター／セッター
 *
 */
  
SVGSprite.DisplayObject.prototype.__defineGetter__("buttonMode", function() {
	
	return this._buttonMode;
	
});

SVGSprite.DisplayObject.prototype.__defineSetter__("buttonMode", function(buttonMode) {
	
	this._buttonMode = Boolean(buttonMode);
	
	if(this._buttonMode) {
		this._svgElement.setAttributeNS(null, "style", "cursor: move");
	} else {
		this._svgElement.setAttributeNS(null, "style", "cursor: normal");	
	}
		
});


/**
  * ラッパーを初期化する
  * 
  * @param {SVGElement}	element SVGエレメント
  * @return {SVGGElement} 一番外周のSVGElement
  * 
  */
SVGSprite.DisplayObject.prototype._init = function(svgElement) {
	
	//xy,scale用のラッパーg要素を作成
	var translateWrapper = document.createElementNS("http://www.w3.org/2000/svg", this._prefix+"g"); //this.svgElement.ownerDocument
	var scaleWrapper = document.createElementNS("http://www.w3.org/2000/svg", this._prefix+"g");
	
	//ラッパーエレメントでラップする
	svgElement.parentNode.replaceChild(translateWrapper, svgElement);
	translateWrapper.appendChild(scaleWrapper);
	scaleWrapper.appendChild(svgElement);

	//ラッパーエレメントを初期化
	this._initTransform(translateWrapper);
	this._initTransform(scaleWrapper);
	
	//this._svgElement を設定
	this._svgElement = translateWrapper;

	//内部保持用属性を初期化
	this._translateX = this._translateY = this._rotation = this.__cx = this.__cy = 0;
	this._scaleX = this._scaleY = 1;


	/**
	 * オリジナルSVGエレメント
	 * @return {SVGElement}
	 */
	this.sourceSVGElement = svgElement;
	
	/**
	 * SVGエレメント
	 * @return {SVGElement}
	 */
	this.svgElement = this._svgElement;

	/**
    * 位置調整用トランスフォームオブジェクト
    * @return {SVGTransform}
    */
	//this._translateTransform = translateWrapper.transform.baseVal.getItem(0);
    this._translateWrapper = translateWrapper;
    
	/**
    * 拡大率調整用トランスフォームオブジェクト
    * @return {SVGTransform}
    */
	//this._scaleTransform = scaleWrapper.transform.baseVal.getItem(0);
    this._scaleWrapper = scaleWrapper;
    
    /**
    * 回転角トランスフォームオブジェクト
    * @return {SVGTransform}
    */
	//this._rotationTransform = scaleWrapper.transform.baseVal.getItem(1);
	
	/**
	* 透明度調整用SVGElement
	* @return {SVGElement}
	*/
	this._alphaSVGElement = scaleWrapper;
	
	/**
	 * x座標
	 * @return {Number}
	 */
	this.x = this._getX();
	
    /**
    * y座標
    * @return {Number}
	*/
	this.y = this._getY();

    /**
    * [読み取り専用] 幅
    * @return {Number}
	*/
	this.width = 'INIT';
	
    /**
    * [読み取り専用] 高さ
    * @return {Number}
	*/
	this.height = 'INIT';

	/**
	 * xの拡大率
	 * @return {Number}
	 */
	this.scaleX = this._getScaleX(); 
	
   /**
    * yの拡大率
    * @return {Number}
		*/
	this.scaleY = this._getScaleY(); 
	
	/**
	* 透明度
	* @return {Number}
	*/
	this.alpha = 1;

	/**
	* xの仮想中心点
	* @return {Number}
	*/
	this._cx = 0;

	/**
	* yの仮想中心点
	* @return {Number}
	*/
	this._cy = 0;	
	
	/**
	* 回転角
	* @return {Number}
	*/
	this.rotation = 0;
	
	/**
	* ボタンモード
	* @return {Boolean}
	*/
	this.buttonMode = false;
		
}

/**
  * Transformを初期化する
  * 
  * @param {SVGElement}	element SVGエレメント
  * @return {Void}
  * 
  */
SVGSprite.DisplayObject.prototype._initTransform = function(element) {
	
	/*
	var baseVal =  element.transform.baseVal; 
	var mainTransform = element.ownerSVGElement.createSVGTransform();
	var subTransform = element.ownerSVGElement.createSVGTransform();

	baseVal.clear();
	baseVal.appendItem(mainTransform);	
	baseVal.appendItem(subTransform);	
	*/
	
	element.setAttribute("transform", "");
	
}


/**
 * SVGSprite.DisplayObjectContainer を初期化する
 * 
 * @class SVGSprite.DisplayObjectContainer は、子要素をもつことができる表示オブジェクトの基本要素です。<br />
 * 子要素の追加、削除、リストの参照などが行えます。
 * 
 * @param {SVGElement} svgElement	SVGElement名
 * @return {Void}
 */
SVGSprite.DisplayObjectContainer = function(svgElement) {
    if (0===0) { //Bugfix for Firefox 9 https://bugzilla.mozilla.org/show_bug.cgi?id=706808
	this.svgElement = svgElement;
    }
}

SVGSprite.DisplayObjectContainer.prototype = new SVGSprite.DisplayObject();

/**
  * 子要素を追加する
  *
  * @param {SVGSprite.DisplayObject} child 追加する子要素
  *
  */
SVGSprite.DisplayObjectContainer.prototype.addChild = function(child) {

	throw new Error("未実装です。");
	
}





/**
 * Sprite を初期化する
 * 
 * @class SVGSprite.Sprite は、表示リストの基本的なオブジェクトです。<br />
 * SVGエレメントのドラッグを有効／無効にすることができます。
 * 
 * @param {SVGElement} svgElement	SVGElement名
 * @return {Void}
 */
SVGSprite.Sprite = function(svgElement) {
    if (0===0) { //Bugfix for Firefox 9 https://bugzilla.mozilla.org/show_bug.cgi?id=706808
	this.svgElement = svgElement;
	
	/**
	 * オリジナルx座標
	 * @return {Number}
	 */
	 this._origX;

	/**
	 * オリジナルy座標
	 * @return {Number}
	 */
	 this._origY;
    }
}

SVGSprite.Sprite.prototype = new SVGSprite.DisplayObjectContainer();


/**
  * ドラッグ可能にする
  *
  * @param {Boolean} lockCenter 未定
  * @param {} bounds
  *
  * @return {Void}
  *
  */
SVGSprite.Sprite.prototype.startDrag = function(lockCenter, bounds) {

	//mousedown を無効化して、不要なドラッグを防止
	this.svgElement.ownerSVGElement.addEventListener("mousedown", function(e){e.preventDefault();}, false);
	
	//ドラッグ範囲の設定
	if(typeof bounds != "undefined" && bounds != null && !isNaN(bounds.x) && !isNaN(bounds.y)  && !isNaN(bounds.width) && !isNaN(bounds.height) ) {
		
		this._bounds = bounds;
		this._bounds.left = this._bounds.x;
		this._bounds.right = this._bounds.x+this._bounds.width;
		this._bounds.top = this._bounds.y;
		this._bounds.bottom = this._bounds.y+this._bounds.height;
			
	} else {
		
		this._bounds = null;
		
	}
	
	//ドラッグ開始
	SVGSprite.Sprite.drag.startDrag(this);

}

/**
  * ドラッグ不可にする
  *
  * @return {Void}
  *
  */
SVGSprite.Sprite.prototype.stopDrag = function() {

	SVGSprite.Sprite.drag.stopDrag();

}



/**
 * ドラッグ管理用オブジェクト
 *
 */
SVGSprite.Sprite.drag = {
	
	/** 現在ドラッグ中のSVGSprite */
	target: null,
	
	/** ターゲットの初期位置 */
	origX: 0,
	origY: 0,
	
	/** ドラッグ時のマウス初期位置 */
	origMouseX: null,
	origMouseY: null
	
}
 
/**
  * ドラッグを開始する
  *
  * @param	{Event}	event	マウスイベント
  * @return {Void}
  *
  */
SVGSprite.Sprite.drag.startDrag = function(target) {
	
	//ターゲットの設定
	this.target = target;
	
	//ターゲットの初期位置を設定
	this.origX = target.x;
	this.origY = target.y;
	
	//ドラッグ開始
	SVGSprite.Sprite.drag.target.svgElement.ownerSVGElement.addEventListener("mousemove", SVGSprite.Sprite.drag._doDrag, true);
}

/**
  * ドラッグを実行する
  *
  * @param	{Event}	event	マウスイベント
  * @return {Void}
  *
  */
SVGSprite.Sprite.drag._doDrag = function(event) {

	var that = SVGSprite.Sprite.drag;
	
	//マウスの初期位置設定
	if(that.origMouseX == null) {
	
		that.origMouseX = event.clientX;
		that.origMouseY = event.clientY;
		
	}
		
	//再描画一時停止
	//var id = that.target.svgElement.ownerSVGElement.suspendRedraw(1000); //Operaの場合 unsuspendRedrawに不具合あり？
		
	//移動
	var x = ((event.clientX-that.origMouseX)/that.target._viewPortScaleX) + that.origX; 
	var y = ((event.clientY-that.origMouseY)/that.target._viewPortScaleY) + that.origY;
	
	//移動制限
	if(that.target._bounds) {
		x = (x < that.target._bounds.left)? that.target._bounds.left : (x+that.target.width > that.target._bounds.right)? that.target._bounds.right-that.target.width : x;
		y = (y < that.target._bounds.top)? that.target._bounds.top : (y+that.target.height > that.target._bounds.bottom)? that.target._bounds.bottom-that.target.height : y;
	}
	
	that.target.x = x;
	that.target.y = y;
	
	//再描画再開
	//that.target.svgElement.ownerSVGElement.unsuspendRedraw(id);
		
}

/**
  * ドラッグを終了する
  *
  * @param	{Event}	event	マウスイベント
  * @return {Void}
  *
  */
SVGSprite.Sprite.drag.stopDrag = function() {
	
	var that = SVGSprite.Sprite.drag;
	
	if(SVGSprite.Sprite.drag.target != null) {
		SVGSprite.Sprite.drag.target.svgElement.ownerSVGElement.removeEventListener("mousemove", SVGSprite.Sprite.drag._doDrag, true);
	}
	
	//各種プロパティを初期化
	that.target = null;
	that.origX = 0;
	that.origY = 0;
	that.origMouseX = null;
	that.origMouseY = null;
		
}

  
  

/**
  * アクセスしやすく
  *
  */

var Sprite = SVGSprite.Sprite;
