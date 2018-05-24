//图片预加载
(function () {
    // loading();
    anmt7();
})();

function loading() {
    const logoText = document.querySelector('.logoText');
    let imgAll = [];
    let num = 0;

    for(let attr in imgData){
        imgAll = imgAll.concat(imgData[attr]);
    }
    let len = imgAll.length;
    for(let i=0;i<imgAll.length;i++){
        let img = new Image();  //给浏览器缓存图片
        img.src = imgAll[i];
        img.onload = function () {  //缓存完成事件
            num++;
            logoText.innerHTML = '已加载' + Math.floor(num/len*100) + '%';
            if(num==len){  //全部缓存完成时执行
                anmt1();
            }
        }
    }
}

//anmt1:隐藏logo1，显示logo2
function anmt1() {
    const view = document.getElementById('view');
    const logo1 = document.getElementById('logo1');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    div2.id = 'logo2';
    div3.id = 'logo3';
    div2.className = div3.className = 'logoImg';
    let img2 = new Image();
    let img3 = new Image();
    img2.src = imgData.logo[0];
    img3.src = imgData.logo[1];
    div2.appendChild(img2);
    div3.appendChild(img3);
    view.appendChild(div2);
    view.appendChild(div3);  //同时创建logo2和logo3，让旋转能同步
    cssTransform(logo2,'translateZ',-1000);
    cssTransform(logo3,'translateZ',-1000);
    css(logo2,'opacity',0);
    css(logo3,'opacity',0);
    MTween({
        el:logo1,
        target:{opacity:0},
        time:1000,
        type:'easeOut',  //隐藏logo1
        callBack: function () {
            view.removeChild(logo1);  //删除logo1
            css(logo2,'opacity',100);
            MTween({
                el:logo2,
                target:{translateZ:30},
                time:100,
                type:'linear',  //让logo2从后往前
                callBack: anmt2
            })
        }
    })
}

//anmt2：隐藏logo2，显示logo3
function anmt2() {
    let logo2 = document.querySelector('#logo2');
    let logo3 = document.querySelector('#logo3');
    setTimeout(function () {  //让logo2停留2秒后执行
        logo2Tologo3();
    },2000);

    function logo2Tologo3() {
        MTween({
            el:logo2,
            target:{translateZ:-1000},
            time:800,
            type:'easeIn',
            callBack: function () {
                view.removeChild(logo2);
                css(logo3,'opacity',100);  //显示logo3
                setTimeout(function (args) {
                    MTween({
                        el:logo3,
                        target:{translateZ:30},
                        time:100,
                        type:'linear',  //让logo3从后往前走
                        callback:anmt3
                    })
                },300)
            }
        })
    }
}

//隐藏logo3
function anmt3() {
    let logo3 = document.querySelector('#logo3');
    MTween({
        el:logo3,
        target:{translateZ:-1000},
        time:800,
        type:'easeIn',
        callBack: function () {
            view.removeChild(logo3);
            anmt4;
        }
    })
}

//显示爆炸效果，隐藏爆炸效果
function anmt4() {
    //生成logo4，内有logo4Img：主logo；logo4Box：内放旋转小图
    let view = document.getElementById('view');
    let logo4 = document.createElement('div');
    let logo4Img = new Image();
    logo4Img.src = imgData.logo[2];
    let logo4Box = document.createElement('div');
    logo4.id = 'logo4';
    logo4Img.id = 'logo4Img';
    logo4Box.id = 'logo4Box';

    //半径随机旋转角度随机的正N边柱
    let iconsLength = 27;  //总共27个小logo
    for(let i=0;i<iconsLength;i++){
        let span = document.createElement('span');

        let degx = Math.round(Math.random()*360);
        let Rx = 20+Math.random()*200;
        let degy = Math.round(Math.random()*360);
        let Ry = 30+(Math.random()-0.5)*340;
        css(span,'rotateY',degx);
        css(span,'translateZ',Rx);
        css(span,'translateY',Ry);
        css(span,'rotateX',degy);

        span.style.backgroundImage = `url(${imgData.logoIco[i%imgData.logoIco.length]})`;
        logo4Box.appendChild(span);
    }

    logo4.append(logo4Img);
    logo4.append(logo4Box);
    view.appendChild(logo4);

    //logo4从远到近，再收回
    css(logo4,'translateZ',-2000);
    MTween({
        el:logo4,
        target:{translateZ:0},
        time:500,
        type:'easeIn',
        callBack: function () {
            setTimeout(function () {
                MTween({
                    el:logo4,
                    target:{translateZ:-1000,scale:10},
                    time:500,
                    type:'easeIn',
                    callBack: function () {
                        view.removeChild(logo4);
                        anmt6();
                    }
                })
            },1000);
            anmt5();
        }
    })
}

//云彩入场，圆柱旋转入场，整体从远到近
function anmt5() {
    let translateZ = document.getElementById('translateZ');  //translateZ控制整体的Z轴位置
    css(translateZ,'translateZ',-2000);
    anmt7();
    anmt6();
    MTween({
        el:translateZ,
        target:{translateZ:200},
        time:3600,
        type:'easeBoth'
    })
}

//主体圆柱入场
function anmt6() {
    let bgSpanBox= document.getElementById('bgSpanBox');
    let len = imgData.bg.length;
    let startDeg = 180;
    let width = 129/2;
    let spanDeg = (180-(360/len))/2;  //内角
    let R = Math.floor(Math.tan(spanDeg*Math.PI/180)*width)-1;
    css(bgSpanBox,'rotateY',-695);  //圆柱初始角度

    //生成20个块拼成一个圆柱
    for(let i=0;i<len;i++){
        let span = document.createElement('span');
        css(span,'rotateY',startDeg);
        css(span,'translateZ',-R);
        span.style.backgroundImage = 'url('+imgData.bg[i]+')';
        span.style.opacity = 0;
        bgSpanBox.appendChild(span);
        startDeg -= (360/len);
    }

    //背景一块一块出现
    let num = 0;
    let timer = setInterval(function () {
        bgSpanBox.children[num].style.opacity = 100;
        num++;
        if(num>=len){
            clearInterval(timer);
        }
    },90)

    //圆柱旋转
    MTween({
        el:bgSpanBox,
        target:{rotateY:25},
        time:3600,
        type:'linear',
        callBack:drag
    })
}

//云朵入场
function anmt7() {
    const cloud = document.getElementById('cloud');
    css(cloud,'translateZ',-200);
    css(cloud,'rotateY',0);
    //生成云朵并围成圆柱
    for(let i=0;i<9;i++){
        let span = document.createElement('span');
        span.style.backgroundImage = 'url('+imgData.cloud[i%3]+')';
        cloud.appendChild(span);

        let R = 180+ (Math.random()-0.5)*20;  //云朵围成圆柱的半径
        let deg = 70*i;  //70 = (180-(360/9))/2
        let x = Math.sin(deg*Math.PI/180)*R;
        let z = Math.cos(deg*Math.PI/180)*R;
        let y = (Math.random()-0.5)*180;
        // css(span,'rotateY',deg*i);  //云朵位移到正确位置，但是不旋转，因为旋转会导致云朵非正面对外
        css(span,'translateZ',z);
        css(span,'translateX',x);
        css(span,'translateY',y);
    }

    //云朵旋转
    MTween({
        el:cloud,
        target:{rotateY:25},
        time:3600,
        type:'linear',
        callBack:drag
    })
}

//左右拖拽圆柱旋转对应角度
function drag() {
    let translateZ = document.querySelector('#translateZ');
    let startZ = css(translateZ,'translateZ');
    // console.log(startZ);
    let bgSpanBox = document.querySelector('#bgSpanBox');
    let origin = {x:0,y:0};
    let originDeg = {x:0,y:0};
    let scale = {x:18/129,y:80/1170};
    let lastDegDis = {x:0,y:0};
    let lastDeg = {x:0,y:0};

    bgSpanBox.addEventListener('touchstart',start);
    bgSpanBox.addEventListener('touchmove',move);
    bgSpanBox.addEventListener('touchend',end);
    
    function start(ev) {
        origin.x = ev.changedTouches[0].pageX;  //初始位置
        origin.y = ev.changedTouches[0].pageY;
        originDeg.x = css(bgSpanBox,'rotateY');  //初始旋转角度
        originDeg.y = css(bgSpanBox,'rotateX');
    }
    function move(ev) {
        let dis = {};
        let nowdeg = {};
        dis['x'] = ev.changedTouches[0].pageX - origin.x;  //移动的距离
        dis['y'] = ev.changedTouches[0].pageY - origin.y;
        // console.log(dis);
        nowdeg['x'] = originDeg.x-dis.x*scale.x;  //水平方向应该旋转到的角度
        nowdeg['y'] = originDeg.y+dis.y*scale.y;  //竖直方向应该旋转到的角度
        if(nowdeg.y>40){
            nowdeg.y = 40;
        }else if(nowdeg.y<-40){  //控制y轴移动角度不要太多
            nowdeg.y = -40;
        }

        lastDegDis.x = nowdeg.x - lastDeg.x;
        lastDegDis.y = nowdeg.y - lastDeg.y;
        lastDeg.x = nowdeg.x;
        lastDeg.y = nowdeg.y;
        // console.log(lastDegDis);

        css(bgSpanBox,'rotateY',nowdeg.x);
        css(bgSpanBox,'rotateX',nowdeg.y);

        //回弹效果，move时往后移动，移动距离与手指滑动距离相关，左滑右滑都是向后移动，所以减去绝对值
        let zMove = Math.min(Math.abs(dis.x),400);
        css(translateZ,'translateZ',startZ-zMove);
    }
    function end(ev) {
        let nowDeg = {x:css(bgSpanBox,'rotateY'),y:css(bgSpanBox,'rotateX')};
        MTween({
            el:bgSpanBox,
            target:{rotateY:nowDeg.x+lastDegDis.x*10,rotateX:nowDeg.y+lastDegDis.y*10},
            time:200,
            type:'easeOut'
        })
        MTween({
            el:translateZ,
            target:{translateZ: startZ},
            time:500,
            type:'easeOut'
        })

    }
}

//背景出现
function redBgAppear() {

}