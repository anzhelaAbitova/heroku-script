
const receipts = []
//receipts.push(...receipts1, ...receipts2, ...receipts3, ...receipts4, ...receipts5, ...receipts6)
receipts.push(...receipts1, ...receipts2, ...receipts3, ...receipts4, ...receipts5, ...receipts6, ...receipts7, ...receipts8)
receipts.forEach((el, index) => {
    el.id = index
})
console.log(receipts)
$(document).ready(function () {
    let fetchErr = false;
    const makeFavPage = async () => {
        const getLogin = () => {
            const arr = Object.keys(localStorage);
            const lKey = arr.find((el) => /tilda_members_profile/.test(el) && !/timestamp/.test(el));

            return JSON.parse(window.localStorage.getItem(lKey) || '{}');
        }
        const getLs = (name, subst = null) => JSON.parse(window.localStorage.getItem(name) || subst)
        const setLs = (name, value) => window.localStorage.setItem(name, JSON.stringify(value))
        const removeLs = (name, subst = null) => JSON.parse(window.localStorage.removeItem(name) || subst)

        const startReceiptSlider = (num, query) => {
            $('.fav-receipts-slider').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
            });
            // Элемент, куда вы хотите записать страницы
            let pages = $('.slider-nums .tn-atom');
            /* if (query) {
                pages = $('.slider-nums .tn-atom');
            } else {
                pages = $('#rec333671598 .slider-nums .tn-atom');
            } */
            // Элемент слайдера
            let slider = $('.fav-receipts-slider');
            let currentSlide = $('.fav-receipts-slider').slick('slickCurrentSlide') + 1;
            let count = $(".fav-receipts-slider").slick("getSlick").slideCount
            pages.text(`${currentSlide}/${count}`)
            slider.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
                let i = (currentSlide ? currentSlide : 0) + 1;
                pages.text(i + '/' + slick.slideCount);
            });
            const arrowsClick = () => {
                $("a[href = '#leftsld']").click(function (event) {
                    $('.fav-receipts-slider .slick-prev').click()
                });
                $("a[href = '#rightsld']").click(function (event) {
                    $('.fav-receipts-slider .slick-next').click()
                });
            }
            arrowsClick()
        }

        const makeFavList = async () => {
            const getFavFromServer = async (obj) => {
                let json = ''
                await fetch(`https://long-cyan-antelope-hose.cyclic.app/receipts?login=${obj}`)
                    .then(async (response) => {
                        console.log('response', response)
                        json =  await response.json();
                    })
                    .catch((err) => console.log(err))
                console.log('json', json)
                return json
            }
            const loginQ = getLogin().login
            const arrServer = await getFavFromServer(loginQ)
            console.log('arrServer', arrServer)
            const favFromServer = (res) => {
                const receiptsArray = res?.props?.receipts.flat(1);
                console.log('favFromServer', receiptsArray)
                let result = []
                if (receiptsArray) {
                    receiptsArray.forEach((el) => {
                        let idR = el.replace(/\D/gi, '')
                        result.push(receipts[parseInt(idR)])
                    })
                } else {
                    fetchErr = true
                }

                return result
            }

            return await favFromServer(arrServer)
        }

        const receiptPopup = (obj) => {
            let result = `<div class="popup-receipt-container">
                        <div class="tn-elem popup-receipt-image" data-elem-type="image">
                            <div class="tn-atom"> <img class="tn-atom__img t-img loaded" data-original="${obj.image}"
                                    imgfield="tn_img_1622378632549" src="${obj.image}"> </div>
                        </div>
                        <div class="popup-receipt">
                            <div class="tn-elem popup-receipt-name" data-elem-type="text">
                                <div class="tn-atom" field="tn_text_1622377714790">${obj.receiptName}</div>
                            </div>
                            <div class="tn-elem tn-elem__3208236061622377681481 popup-text" 
                                data-elem-type="text">
                                <div class="tn-atom" field="tn_text_1622377681481">Ингредиенты:</div>
                            </div>
                            <div class="tn-elem popup-receipt-ingredients" data-elem-type="text">
                                <ul>`
            if (obj.ingredients) {
                obj.ingredients.forEach((el) => {
                    result += `<li><div class="tn-atom" field="tn_text_1622377770713">- ${el.measure} ${el.product}</div></li>`
                })
            } else if (obj.forPart) {

                obj.forPart.forEach((el) => {
                    console.log(el)
                    result += ` <li><div class="tn-atom" field="tn_text_1622377770713">${el.partName}</div></li>`
                    el.ingredients.forEach((elI) => {
                        result += `<li><div class="tn-atom" field="tn_text_1622377770713">- ${elI.measure} ${elI.product}</div></li>`
                    })
                })
            }


            result += `</ul>
                                
                            </div>
                            <div class="tn-elem popup-bigger-text" data-elem-type="text">
                                <div class="tn-atom" field="tn_text_1622378057514">Приготовление:</div>
                            </div>
                            <div class="tn-elem popup-receipt-steps"data-elem-type="text">
                                <ul>`
            obj.steps.forEach((el) => {
                result += `<li><div class="tn-atom" field="tn_text_1622378070692">${el}</div></li>`
            })

            result += `</ul>
                            </div>
                            <div class="tn-elem popup-receipt-btn">
                                <div class="tn-elem popup-back"
                                    data-elem-type="button">
                                    <div class="tn-atom">Назад</div>
                                </div>
                                <div class="tn-elem popup-add-fav popup-favorities" id="receipt-fav-${obj.id}">
                                    <div class="tn-atom"><img class="tn-atom__img t-img loaded" 
                                            data-original="https://static.tildacdn.com/tild3661-3038-4064-b161-346562656631/photo.svg"  
                                            imgfield="tn_img_1622382395420" 
                                            src="https://static.tildacdn.com/tild3661-3038-4064-b161-346562656631/photo.svg">
                                    </div>
                                    <div class="tn-atom" field="tn_text_1622382423650">Убрать из избранного</div>
                                </div>
                            </div>
                        </div>
                    </div>`
            return result
        }

        const makeSearchResults = async (main, arr, query) => {
            try {
                if (arr && arr.length) {
                    const slidesIds = []
                    const slides = []
                    let numCard = 0
                    if (query <= 1) {
                        numCard = 5
                    } else {
                        numCard = 3
                    }
                    const slideReceipt = (array) => {
                        const midResult = []
                        const slidesDom = []
                        const images = []
                        const links = []
                        const names = []
                        for (let i = 0; i < arr.length / numCard; i++) {
                            midResult.push('<div class="receipt-fav-slide-wrapper"><div class="receipt-fav-slide">')
                            midResult.push('</div></div>')
                            for (let j = 0; j < numCard; j++) {
                                if (array[i * numCard + j]) {
                                    images.push(`<div class="t396__elem receipt-image tn-elem" 
                                    data-elem-type="image">
                                    <div class="tn-atom"> <img class="tn-atom__img t-img loaded"
                                            data-original="${array[i * numCard + j].image}" imgfield="tn_img_1622325506285"
                                            src="${array[i * numCard + j].image}"> </div>
                                    </div>`)
                                    names.push(`<div class="t396__elem receipt-name loaded tn-elem"
                                    id="${array[i * numCard + j].id}"
                                    data-elem-type="text"> <div class=" tn-atom">
                                    ${array[i * numCard + j].receiptName}</div> </div>`)
                                    links.push(`<div class="t396__elem receipt-link loaded tn-elem"
                                    id="${array[i * numCard + j].id}"
                                    data-elem-type="button"> <a class=" tn-atom"
                                    href="#popup:recept">Рецепт</a> </div>`)
                                } else {
                                    images.push(`<div class="t396__elem receipt-image tn-elem" 
                                    data-elem-type="image">
                                    <div class="tn-atom"> </div>
                                    </div>`)
                                    names.push(`<div class="t396__elem receipt-name tn-elem"
                                    data-elem-type="text"></div>`)
                                    links.push(`<div class="t396__elem receipt-link tn-elem"
                                    data-elem-type="button"></div>`)
                                }

                            }
                        }
                        for (let i = 0; i < arr.length / numCard; i++) {
                            const temp = [midResult[i * 2], images.slice(i * numCard, numCard * (i + 1)).join(''), names.slice(i * numCard, numCard * (i + 1)).join(''), links.slice(i * numCard, numCard * (i + 1)).join(''), midResult[i * 2 + 1]]
                            slidesDom.push(temp.join(''))
                        }
                        return slidesDom
                    }
                    const receiptSlides = slideReceipt(arr)
                    const createSlider = () => {
                        return $('<div>', {
                            class: "fav-receipts-slider",
                        });
                    }

                    const slider = createSlider()
                    main.html('')
                    for (let i = 0; i < arr.length / numCard; i++) {
                        slider.append(receiptSlides[i])
                    }

                    main.append(slider)
                    console.log(slider)
                    //main.append('<div class="fav-receipts-count"></div>')

                    const popupCssFix = (heightC) => {
                        console.log(heightC)
                        //$('#rec320823606 .t396__artboard').css({height: (heightC + 200) + 'px'})
                        //$('#rec320918600 .t-popup').css({height: (heightC + 200) + 'px'})
                        $('#rec333617461 .t-popup__container').css({ height: (heightC + 200) + 'px' })

                        //$('#rec320823606 .t396__carrier').css({height: (heightC + 200) + 'px'})
                        //$('#rec320823606 .t396__filter').css({height: (heightC + 200) + 'px'})
                    }
                    //startReceiptSlider(arr.length / numCard, query)
                    $('.receipt-link').click(function (e) {
                        const id = $(this).attr('id')
                        $('#rec333617461').html('')
                        if ($('#rec333617461 .popup-receipt-container').length) {
                            $('#rec333617461 .popup-receipt-container').remove()

                        }
                        // Создаётся объект promise
                        let promise = new Promise((resolve, reject) => {

                            setTimeout(() => {
                                $('#rec333617461').append(receiptPopup(receipts[parseInt(id)]))
                                // переведёт промис в состояние fulfilled с результатом "result"
                                resolve("result");
                            }, 100);

                        });

                        // promise.then навешивает обработчики на успешный результат или ошибку
                        promise
                            .then(
                                result => {
                                    console.log(result)
                                    popupCssFix($('#rec333617414 .popup-receipt-container').outerHeight())
                                    $('.popup-back').off().on('click', (e) => {
                                        console.log(e.target)
                                        t390_closePopup('#rec333617414'.replace(/[^0-9]/gim, ""))
                                    })
                                    $('.popup-add-fav').off().on('click', function (e) {
                                        const idF = $(this).attr('id')
                                        if (getLs(idF)) {
                                            const receiptToSend = {
                                                login: login,
                                                receipts: idF,
                                                isDelete: true
                                            }
                                            removeLs(idF)
                                            const isFav = async (obj) => {
                                                const login = getLogin().login
                                                let json = ''
                                                if (login) {
                                                    try{
                                                        let response = await fetch('https://long-cyan-antelope-hose.cyclic.app/receipts', {
                                                          method: 'POST',
                                                          headers: {
                                                            'Content-Type': 'application/json;charset=utf-8'
                                                          },
                                                          body: JSON.stringify(obj)
                                                        });
                                                        console.log(response)
                                                    } catch(err) {
                                                        console.log(err)
                                                    }
                                                }

                                                return json
                                            }
                                            isFav();
                                            $('#rec333617461 .popup-add-fav .tn-atom:nth-child(2)').text('Добавить в избранное')
                                            $('#rec333617461 .popup-add-fav .tn-atom:nth-child(1)').html('<img class="tn-atom__img t-img loaded" data-original="https://static.tildacdn.com/tild3632-3738-4466-a362-353766396335/photo.svg" imgfield="tn_img_1622382395420" src="https://static.tildacdn.com/tild3632-3738-4466-a362-353766396335/photo.svg">')


                                        } else {
                                            setLs(idF, idF)
                                            $('#rec333617461 .popup-add-fav .tn-atom:nth-child(2)').html('<a href="">Добавлено в избранное</a>')
                                            $('#rec333617461 .popup-add-fav .tn-atom:nth-child(1)').html('<a href=""><img class="tn-atom__img t-img loaded" data-original="https://static.tildacdn.com/tild3661-3038-4064-b161-346562656631/photo.svg"  imgfield="tn_img_1622382395420" src="https://static.tildacdn.com/tild3661-3038-4064-b161-346562656631/photo.svg"></a>')
                                            console.log(getLs(idF))
                                        }
                                    })

                                },
                                error => {
                                    console.log(error)
                                }
                            );
                    })
                } else {
                    console.log('nothing')
                    $('#rec333646716').html('')
                    $('#rec333646716').append(`<div class='tn-elem add-to-nothing'>
                        <div class='tn-atom'>
                            Вы пока еще ничего не добавили в избранное
                        </div>
                    </div>`)
                }
            } catch (e) {
                console.log(e)
            }
        }

        const mediaQuery1 = window.matchMedia('(max-width: 960px)');
        const mediaQuery2 = window.matchMedia('(max-width: 640px)');
        const mediaQuery3 = window.matchMedia('(max-width: 480px)');
        const mediaQuery4 = window.matchMedia('(max-width: 320px)');

        const winSizeMatch = (arr) => {
            const result = arr.findIndex(el => el === false)
            return result !== -1 ? result : 3
        }
        let once = true
        const queries = []
        const makeSlider = () => {
            queries.push(mediaQuery1.matches, mediaQuery2.matches, mediaQuery3.matches, mediaQuery4.matches)

            const query = winSizeMatch(queries)

            const promiseR = new Promise((resolve, reject) => {
                return resolve(makeFavList());
            });
            promiseR
                .then(rest => {
                    makeSearchResults($('#rec333646716'), rest, query)
                })
                .catch((err) => {
                    console.log(err)
                    makeSearchResults($('#rec333646716'), [], query)
                })

            if ("ontouchstart" in document.documentElement) {
                touchDevice = true
                console.log(touchDevice, "your device is a touch screen device.")
            } else {
                touchDevice = false
                console.log(touchDevice, "your device is a Not touch screen device.")
            }
            if (mediaQuery2.matches) {
                if (once) {

                    //slider(sldMobileID, btnMobileID, countMobile)
                }
                once = false
                //receiptsSlider(sldMobileID, 1)
                return false
            } else {
                if (once) {
                    /*if(touchDevice) {
                        sliderMobileFix(sldDesktopID)
                    }*/
                    //slider(sldDesktopID, btnDesktopID, countDesktop)
                }
                once = false
                return true
            }
        }
        makeSlider()
    }

    makeFavPage()
    let idJquery
    let width = $(window).outerWidth()
    function jqueryResize() {
        queries.length = 0
        try {
            makeFavPage()
        } catch (e) {
            console.log(e)
        }
    }

    $(window).on('resize', function () {
        clearTimeout(idJquery);
        if (width !== $(window).outerWidth()) {
            id = setTimeout(jqueryResize, 500);
        }

    });
})
