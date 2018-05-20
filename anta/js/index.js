//图片预加载
(function () {
    loading();
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

//隐藏logo3，显示爆炸效果
function anmt3() {
    let logo3 = document.querySelector('#logo3');
    MTween({
        el:logo3,
        target:{translateZ:-1000},
        time:800,
        type:'easeIn',
        callBack: function () {
            view.removeChild(logo3);

        }
    })
}