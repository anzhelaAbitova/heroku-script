
const productList = Array(10).fill({});
const receiptsList = Array(10).fill({})
const receipts = []
receipts.push(...receipts1, ...receipts2, ...receipts3, ...receipts4, ...receipts5, ...receipts6, ...receipts7)
const queries = []
let measureCheck = true
let touchDevice = false
receipts.forEach((el, index) => {
    el.id = index
})
console.log(receipts)
const isDoubleClicked = (element) => {
    if (element.hasClass("isclicked")) return true;
    element.addClass("isclicked");
    setTimeout(function () {
        element.removeClass("isclicked");
    }, 1000);
    return false;
}

const calcFromStock = (query) => {
    try {
        const getLogin = () => {
            const arr = Object.keys(localStorage);
            const lKey = arr.find((el) => /tilda_members_profile/.test(el) && !/timestamp/.test(el));
            
            return JSON.parse(window.localStorage.getItem(lKey) || '{}');
        }

        const getLs = (name, subst = null) => JSON.parse(window.localStorage.getItem(name) || subst)
        const setLs = (name, value) => window.localStorage.setItem(name, JSON.stringify(value))
        const removeLs = (name, subst = null) => JSON.parse(window.localStorage.removeItem(name) || subst)
        let catIn = 0
        const resetCalc = (queryR) => {
            for(let i = 0; i < productList.length; i++) {
                productList[i] = {}
            }
            $('.dish-list input').each(function() {
                $(this).prop('checked',false);
            });
            measureCheck = true
            $('#rec317028063').hide()
            $('#rec317127407').hide()
            $('#rec332464315').addClass('well-hidden')
            $('#rec332450844').addClass('well-hidden')
            if (queryR) {
                $('#rec317126825').addClass('well-hidden')
            } else {
                $('#rec317292231').addClass('well-hidden')
            }
        }
        for(let i = 0; i < categoriesProducts.length; i++) {
            for(let j = 0; j < categoriesProducts[i].length; j++) {
                categoriesProducts[i][j].id = catIn
                catIn++
            }
        }
        console.log(categoriesProducts)

        const startReceiptSlider = (num, query) => {
            $('.result-receipts-slider').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
            });
            // Элемент, куда вы хотите записать страницы
            let pages = ''
            if (query) {
                pages = $('#rec317126825 .slider-nums .tn-atom');
            } else {
                pages = $('#rec317292231 .slider-nums .tn-atom');
            }
            // Элемент слайдера
            let slider = $('.result-receipts-slider');
            let currentSlide = $('.result-receipts-slider').slick('slickCurrentSlide') + 1;
            let count = $(".result-receipts-slider").slick("getSlick").slideCount
            pages.text(`${currentSlide}/${count}`)
            slider.on('init reInit afterChange', function(event, slick, currentSlide, nextSlide){
                let i = (currentSlide ? currentSlide : 0) + 1;
                pages.text(i + '/' + slick.slideCount);
            });
            const arrowsClick = (query) => {
                if (query) {
                    $("#rec317126825 a[href = '#leftsld']").click(function (event) {
                        $('.result-receipts-slider .slick-prev').click()
                    });
                    $("#rec317126825 a[href = '#rightsld']").click(function (event) {
                        $('.result-receipts-slider .slick-next').click()
                    });
                } else {
                    $("#rec317292231 a[href = '#leftsld']").click(function (event) {
                        $('.result-receipts-slider .slick-prev').click()
                    });
                    $("#rec317292231 a[href = '#rightsld']").click(function (event) {
                        $('.result-receipts-slider .slick-next').click()
                    });
                }
            }
            arrowsClick(query)
        }

        const checkIsMeasure = (arr) => {
            const result = arr.some((el) => {
                return el.productMeasure
            })
            return result
        }
        
        const receiptPopup = (obj, added) => {
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
                            </div>`
                            if (added) {
                                result += `<div class="tn-elem popup-add-fav popup-favorities" id="receipt-fav-${obj.id}">
                                <div class="tn-atom">
                                <a href="/favorites">
                                <img class="tn-atom__img t-img loaded" 
                                    data-original="https://static.tildacdn.com/tild3661-3038-4064-b161-346562656631/photo.svg"  
                                    imgfield="tn_img_1622382395420" 
                                    src="https://static.tildacdn.com/tild3661-3038-4064-b161-346562656631/photo.svg">
                                    </a>
                                </div>
                                <div class="tn-atom" field="tn_text_1622382423650"><a href="/favorites">Добавлено в избранное</a></div>`
                            } else {
                                result += `<div class="tn-elem popup-add-fav popup-favorities" id="receipt-fav-${obj.id}">
                                <div class="tn-atom"> <img class="tn-atom__img t-img loaded"
                                        data-original="https://static.tildacdn.com/tild3632-3738-4466-a362-353766396335/photo.svg"
                                        imgfield="tn_img_1622382395420"
                                        src="https://static.tildacdn.com/tild3632-3738-4466-a362-353766396335/photo.svg"> 
                                </div>
                                <div class="tn-atom" field="tn_text_1622382423650">Добавить в избранное</div>`
                            }
                            
                            result += `</div>
                        </div>
                    </div>
                </div>`
                return result
        }

        const searchReceipt = (products, receipts) => {
            try {
                const result = []
                
                const uniqueResult = (arr) => {
                    const flags  = {};
                    const uResult = arr.filter(function(entry) {
                        if (flags[entry.id]) {
                            //console.log('not-unique', flags[entry.id])
                            return false;
                        }
                        flags[entry.id] = true;
                        return true;
                    });
                    return uResult
                }
                
                const searchName = (productN, ingredientN) => {
                    let resultN = false
                    if (productN.match(/\^/g)) {
                        const elName = productN.replace(/\^/g, '').toLowerCase()
                        const objName = ingredientN.replace(/[^(]*$/, '').replace(/[ \(]/g, '').toLowerCase()
                        let regexp = new RegExp(`^${elName}$`);
                        resultN = objName.includes(elName)
                        //console.log(elName,objName,resultN)
                        return resultN
                    }
                    if (productN.match(/,/g)) {
                        const objName = ingredientN.toLowerCase()
                        const elNameArr = [...productN.split(',')]
                        for (let i = 0; i < elNameArr.length; i++) {
                            const elName = elNameArr[i].toLowerCase()
                            resultN = objName.includes(elName)
                            if (resultN) break
                        }
                    } else {
                        const elName = productN.toLowerCase()
                        const objName = ingredientN.toLowerCase()
                        
                        resultN = objName.includes(elName)
                    }
                    return resultN
                }
                
                const searchMeasure = (productM, ingredientM) => {
                    const meas = productM
                    const receipt = ingredientM
                    const regex = new RegExp(meas, 'g');
                    const matchArr = parseInt(meas.replace(/\D/g, '')) >= parseInt(receipt.replace(/\D/g, ''))
                    
                    return matchArr
                }

                products.forEach((el, index) => {
                    if (el.productSearch) {
                        const productS = el.productSearch
                        receipts.forEach((elr, indexr) => {
                            if (elr.receiptName) {
                                if (elr.forPart) {
                                    elr.forPart.forEach((elP) => {
                                        const receiptsForProduct = elP.ingredients.filter(obj => {

                                            if (measureCheck) {
                                                return searchName(productS, obj.product) && searchMeasure(el.productMeasure, obj.measure)
                                            } else {
                                                return searchName(productS, obj.product)
                                            }
                                        })
                                        if (receiptsForProduct.length) {
                                            result.push(elr)
                                        }
                                    })

                                } else {
                                    const receiptsForProduct = elr.ingredients.filter(obj => {

                                        if (measureCheck) {
                                            return searchName(productS, obj.product) && searchMeasure(el.productMeasure, obj.measure)
                                        } else {
                                            return searchName(productS, obj.product)
                                        }
                                    })
                                    if (receiptsForProduct.length) {
                                        result.push(elr)
                                    }
                                }

                            }
                        })

                    }
                })
                //console.log('unique result', uniqueResult(result))
                return result.length ? uniqueResult(result) : false
            } catch (e) {
                console.log(e)
            }

        }

        const makeSearchResults = (main, arr, queryS) => {
            try{
            if (arr) {
                //console.log(arr)
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
                    for(let i = 0; i < arr.length / numCard; i++) {
                        midResult.push('<div class="receipt-result-slide-wrapper"><div class="receipt-result-slide">')
                        midResult.push('</div></div>')
                        for(let j = 0; j < numCard; j++) {
                            if (array[i * numCard + j]) {
                                images.push(`<div class="t396__elem receipt-image tn-elem" 
                                data-elem-type="image">
                                <div class="tn-atom"> <img class="tn-atom__img t-img loaded"
                                        data-original="${array[i * numCard + j].image}" imgfield="tn_img_1622325506285"
                                        src="${array[i * numCard + j].image}"> </div>
                                </div>`)
                                links.push(`<div class="t396__elem receipt-link loaded tn-elem"
                                id="${array[i * numCard + j].id}"
                                data-elem-type="button"> <a class=" tn-atom"
                                href="#popup:recept">Рецепт</a> </div>`)
                            } else {
                                images.push(`<div class="t396__elem receipt-image tn-elem" 
                                data-elem-type="image">
                                <div class="tn-atom"> </div>
                                </div>`)
                                links.push(`<div class="t396__elem receipt-link tn-elem"
                                data-elem-type="button"></div>`)
                            }

                        }
                    }
                    for (let i = 0; i < arr.length / numCard; i++) {
                        const temp = [midResult[i*2], images.slice(i * numCard, numCard * (i + 1)).join(''), links.slice(i * numCard, numCard * (i + 1)).join(''), midResult[i * 2 + 1]]
                        slidesDom.push(temp.join(''))
                    }
                return slidesDom
                }
                const receiptSlides = slideReceipt(arr)
                const createSlider = () => {
                    return $('<div>', {
                        class: "result-receipts-slider",
                    });
                }

                const slider = createSlider()
                main.html('')
                for (let i = 0; i < arr.length / numCard; i++) {
                    slider.append(receiptSlides[i])
                }
                
                main.append(slider)
                main.append('<div class="result-receipts-count"></div>')

                const popupCssFix = (heightC = 0) => {
                    console.log(heightC, 'heightC')
                    $('#rec320918600 .t-popup__container').css({height: ((heightC < 600 ? 600 : heightC)+ 200) + 'px'})
                }
                startReceiptSlider(arr.length / numCard, queryS)
                $('.receipt-link').click(function(e) {
                    const id = $(this).attr('id')
                    $('#rec320823606').html('')
                    console.log($('#rec320823606 .popup-receipt-container').length)
                    if ($('#rec320823606 .popup-receipt-container').length) {
                        $('#rec320823606 .popup-receipt-container').remove()
                        
                    }
                    const login = getLogin().login
                    const isFav = async (obj) => {
                        let json = ''
                        if (login) {
                            await fetch(`https://long-cyan-antelope-hose.cyclic.app/receipt-for-one?login=${login}&receipts=receipt-fav-${id}`)
                            .then(async (response) => {
                                json = await response.json();
                              })
                            .catch((err)=> console.log(err))
                        }
                              
                        return json 
                    }
                    let promise = new Promise((resolve, reject) => {
                        let isAdded = getLs(`receipt-fav-${id}`)
                        let isAddedFromServer = isFav()
                        resolve(isAdded || isAddedFromServer)
                    }).then(added => {
                                if ($('#rec320823606 .popup-receipt-container').length) {
                                    $('#rec320823606 .popup-receipt-container').remove()
                                    
                                }
                                $('#rec320823606').append(receiptPopup(receipts[parseInt(id)], added))
                                console.log('outerHeight', $('#rec320823606 .popup-receipt-container').outerHeight())
                                return $('#rec320823606 .popup-receipt-container').outerHeight();
                        })
                        .then(result => {
                            console.log('result', result)
                            popupCssFix(result)
                            setTimeout(() => {
                                console.log($('#rec320823606 .popup-receipt-container'))
                                $('.popup-back').off().on('click', (e) => {
                                    t390_closePopup('#rec320918600'.replace(/[^0-9]/gim, ""))
                                })
                                $('.popup-add-fav').off().on('click', function(e) {
                                    const idF = $(this).attr('id')
                                    const receiptToSend = {
                                        login: login,
                                        receipts: idF,
                                        isDelete: false
                                    }
                                    if (!getLs(idF)) {
                                        setLs(idF, idF)
                                        const sendFavToServer = async (obj) => {
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
                                        sendFavToServer(receiptToSend)
                                        $('#rec320823606 .popup-add-fav .tn-atom:nth-child(2)').html('<a href="/favorites">Добавлено в избранное</a>')
                                        $('#rec320823606 .popup-add-fav .tn-atom:nth-child(1)').html('<a href="/favorites"><img class="tn-atom__img t-img loaded" data-original="https://static.tildacdn.com/tild3661-3038-4064-b161-346562656631/photo.svg"  imgfield="tn_img_1622382395420" src="https://static.tildacdn.com/tild3661-3038-4064-b161-346562656631/photo.svg"></a>')
                                    } 
                                })                                
                            }, 200)

                            
                        })
                        .catch(error => console.log(error));
                })
            }
            } catch (e) {
                console.log(e)
            }
        }

        const makeProductList = (arr) => {
            const main = '#rec317028063';
            const list = []
            let count = 0
            arr.forEach((el, index) => {
                if (el.productName) {
                    const item = `<div class="product-receipt-el">
                        <div class="t396__elem tn-elem product-receipt tn-elem__3170280631621436592149"
                        data-elem-type="text">
                            <div class="tn-atom" field="tn_text_1621436592149">${el.productName}</div>
                        </div>
                            <input type="number" name="product-receipt" id="product-receipt-${index}" class="product-receipt-measure" placeholder="ввести вес продукта">
                        </div>`
                    list.push(item)
                    count++
                }
            })
            const measureCheck = `<div class="t396__elem product-measure-check tn-elem tn-elem__3170280631621436592073" 
                        data-elem-type="text">
                            <input type="checkbox" name="product-measure-check" id="product-measure-check">
                            <label for="product-measure-check">без учета веса</label>
                        </div>`
            const btnSearch = `<div class="t396__elem product-receipt-search tn-elem tn-elem__3170280631621436592090" data-elem-id="1621436592090"
                        data-elem-type="button">
                            <button class="tn-atom">Подобрать рецепты</button>
                        </div>`
            const heightEl = 60 * count + 95
            $(`${main} .t396__artboard`).css({
                height: `${heightEl}px`
            })
            $(`${main} .t396__carrier`).css({
                height: `${heightEl}px`
            })
            $(`${main} .t396__filter`).css({
                height: `${heightEl}px`
            })
            const result = `<div class="product-list" style="height: ${heightEl}px">` +
                list.join('') +
                measureCheck +
                btnSearch +
                '</div>'
            return result
        }

        const makeCheckboxList = (num, idEl) => {
            const checkCSS = $('[data-elem-id="1621434486430"]').offset()
            const makeForm = (num, arr) => {
                let result = `<form action="" class="dish-list" id="${dish-list-num}">`
                const array = []
                arr.forEach((el, index) => {
                    array.push(`<input type="checkbox" name="dish-product-${index}" id="dish-product-${index}" class="dish-product">
                    <label for="dish-product-${index}">${el}</label>`)
                })

                return result + array.join() + '</form>'
            }
            const createInput = (i, search) => {
                return $('<input>', {
                    id: "dish-product-" + num + '-' + i,
                    class: "dish-product",
                    name: "dish-product-" + i,
                    type: "checkbox",
                });
            }
            const createLabel = (i, el) => {
                return $('<label>', {
                    for: "dish-product-" + num + '-' + i,
                    text: el
                });
            }
            const createForm = (i) => {
                return $('<form>', {
                    id: "dish-list-" + num,
                    class: "dish-list"
                });
            }
            const createFormCon = () => {
                return $('<div>', {
                    class: "dish-list-container"
                });
            }
            
            const form = createForm(num)
            const formCon = createFormCon()

            let catIndex = 0
            if (query <= 1) {
                catIndex = 1
            } else {
                catIndex = 2
            }
            for (let i = 0; i < categoriesProducts[idEl-1].length; i++) {
                const checkbox = createInput(i, categoriesProducts[idEl-1][i].produstSearch)
                const label = createLabel(i, categoriesProducts[idEl-1][i].productName)
                checkbox.attr('data-elem-search', categoriesProducts[idEl-1][i].productSearch)
                checkbox.attr('data-elem-id', categoriesProducts[idEl-1][i].id)
                checkbox.click(function (e) {
                    if ($(this).is(':checked')) {
                        $(this).attr("checked", "checked")
                        const idNum = $(this).attr('data-elem-id')

                        const productText = $("label[for='" + this.id + "']").text()
                        const productTextSearch = $(this).attr('data-elem-search')
                        productList[parseInt(idNum)] = {
                            'productName': productText,
                        }
                        productList[parseInt(idNum)].in = idNum
                        productList[parseInt(idNum)].productSearch = productTextSearch

                        $('.product-list-make').off('click').on('click touch', function (e) {
                            if (e.cancelable) {
                                e.preventDefault();
                                e.stopImmediatePropagation()
                            }
                            if (isDoubleClicked($(this))) return;
                            let listProduct = false
                            for (let i = 0; i < productList.length; i++) {
                                if (productList[i] && productList[i].productSearch) {
                                    listProduct = true
                                    break
                                } 
                            }
                            measureCheck = true
                            if (!listProduct) return
                            if ($('.product-list').length) {
                                $('.product-list').remove()
                            }
                            $('#rec317028063').show()
                            console.log(productList)
                            $('#rec317028063 .t396__artboard.rendered').append(makeProductList(productList));
                            $('.product-receipt-measure').change(function (e) {
                                const id = e.target.id
                                productList[parseInt(id.replace(/\D/g, ''))].productMeasure = $(this).val()
                            })
                            $('#product-measure-check').change((e) => {
                                measureCheck = !measureCheck
                            })

                            $('.product-receipt-search').off('click').on('click touch', function (e) {
                                if (e.cancelable) {
                                    e.preventDefault();
                                    e.stopImmediatePropagation()
                                }
                                if (isDoubleClicked($(this))) return;

                                const textR = 'Вот что можно приготовить:'
                                const textE = 'Отметьте, пожалуйста, вес продуктов'
                                const textN = 'По вашему запросу ничего не найдено'
                                const isMeasure = measureCheck ? checkIsMeasure(productList) : true
                                if (isMeasure) {

                                    $('.receipt-search-response .tn-atom').text(textR)
                                    const searchResult = searchReceipt(productList, receipts)
                                    $('#rec317127407').show()
                                    console.log(searchResult)

                                    if (searchResult) {

                                        if (query <= 1) {
                                            $('#rec317126820').removeClass('well-hidden')
                                            $('#rec332464315').removeClass('well-hidden')
                                            $('#rec317126825').removeClass('well-hidden')
                                            makeSearchResults($('#rec332464315'), searchResult, true)

                                        } else {
                                            $('#rec317292225').removeClass('well-hidden')
                                            t_lazyload_update();
                                            $('#rec317292231').removeClass('well-hidden')
                                            $('#rec332464315').removeClass('well-hidden')
                                            makeSearchResults($('#rec332464315'), searchResult, false)
                                        }
                                        $('#rec332450844').removeClass('well-hidden')
                                        $('.receipt-reset').off().on('click', function(e) {
                                            resetCalc(query <= 1 ? true : false)
                                        })
                                    } else {
                                        if (query <= 1) {
                                            $('#rec317126825').addClass('well-hidden')
                                            $('#rec317126820').addClass('well-hidden')
                                        } else {
                                            $('#rec317292225').addClass('well-hidden')
                                            $('#rec317292231').addClass('well-hidden')
                                        }
                                        
                                        $('#rec332450844').removeClass('well-hidden')
                                        $('.receipt-reset').off().on('click', function(e) {
                                            resetCalc(query <= 1 ? true : false)
                                        })

                                        $('#rec317127407').show()
                                        $('.receipt-search-response .tn-atom').text(textN)
                                        $('.receipt-search-response').css({
                                            width: '80vw',
                                            margin: '0 auto'
                                        })
                                    }
                                } else {
                                    if (query <= 1) {
                                        $('#rec317126825').addClass('well-hidden')
                                        $('#rec317126820').addClass('well-hidden')
                                        //$('#rec317126820').hide()
                                        //$('#rec317126825').hide()
                                    } else {
                                        $('#rec317292225').addClass('well-hidden')
                                        $('#rec317292231').addClass('well-hidden')
                                    }
                                    
                                    $('#rec332450844').removeClass('well-hidden')
                                    $('.receipt-reset').off().on('click', function(e) {
                                        resetCalc(query <= 1 ? true : false)
                                    })
                                    $('#rec317127407').show()
                                    $('.receipt-search-response .tn-atom').text(textE)
                                }



                            })

                        })

                    } else {
                        $(this).removeAttr("checked");
                        const idNum = $(this).attr('data-elem-id')
                        productList[parseInt(idNum)] = {}
                        console.log(productList)
                    }

                })
                form.append(checkbox)
                form.append(label)
                formCon.append(form)
            }
            return formCon
        }

        const sliderProductCss = (elem, data, dataArrow, over) => {
            const attrs = ['data-artboard-height', 'data-artboard-proxy-min-height', 'data-artboard-proxy-max-height']
            attrs.forEach(el => {
                elem.removeAttr(el);
                elem.attr(el, data);
            })
            elem.css({
                height: data + 'px'
            })
            elem.find('.t396__carrier').css({
                height: data + 'px'
            })
            elem.find('.t396__filter').css({
                height: data + 'px'
            })
            elem.closest('.slick-track').css({
                'height': data + 'px'
            })
            elem.closest('.t-slds__items-wrapper').css({
                'height': data + 'px'
            })
        }

        let totalClicks = 0
        
        const classNum = (elem, classS) => {
            let result = ''
            const arr = elem.attr('class').split(' ')
            arr.forEach((el) => {
                if (el.includes(classS)) {
                    result = el
                }
            })
            return result
        }
        
        $('[class^="product-add"], [class*="product-add"]').off().on('click touchstart', function (event) {
            if (event.cancelable) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation()
            }
            if (isDoubleClicked($(this))) return;
            const measure = $(this).position()

            const index = $(this).index()
            const elId = $(this).attr('data-elem-id')
            const elNum = $(this).attr('id') || classNum($(this), 'product-add')
            const main = $(this).closest('.t396__artboard')
            if (!$(`#dish-list-${elId}`).length) {
                main.append(makeCheckboxList(parseInt(elId.replace(/\D/g, '')), parseInt(elNum.replace(/\D/g, ''))))
                const widthM = $(this).outerWidth(true)
                const heightM = $(this).outerHeight(true)

                $(`#dish-list-${elId}`).closest('.dish-list-container').css({
                    left: measure.left + 'px',
                    top: measure.top + heightM - 2 + 'px',
                    width: widthM + 'px'
                })
                if (query <= 1) {
                    if(touchDevice) {
                        //dishListTouchFix(measure.left, widthM, measure.top + heightM - 2)
                    }
                    sliderProductCss(main, '585', '184', 'auto')
                } else if (query <= 2) {
                    
                    sliderProductCss(main, '475', '184', 'auto')
                } else if (query <= 3) {
                    sliderProductCss(main, '445', '184', 'auto')
                }

            } else {
                if ($('.dish-list').length === 1) {
                    if (query <= 1) {
                        sliderProductCss(main, '395', '0', 'auto')
                    } else if (query <= 2) {
                        sliderProductCss(main, '475', '0', 'auto')
                    } else if (query <= 3) {
                        sliderProductCss(main, '235', '0', 'auto')
                    }
                }
                $(`#dish-list-${elId}`).closest('.dish-list-container').remove()
            }


        })
        let sliderReceipts = ''
        $('#rec317028063 .t396__elem').remove()
        $('#rec317028063 .product-list').remove()

        if (query <= 1) {
            $('#rec317028063').hide()
            $('#rec317127407').hide() // arrows slider
            $('#rec317126825').addClass('well-hidden')
            $('#rec317132644').hide()
            $('#rec317126820').addClass('well-hidden')
            $('#rec332450844').addClass('well-hidden')
            $('#rec317014679').addClass('well-hidden')
            $('#rec332464315').addClass('well-hidden')
        } else {
            $('#rec317126821').hide()
            $('#rec317127407').hide()
            $('#rec317292225').addClass('well-hidden')
            $('#rec317126825').hide()
            $('#rec317132644').hide()
            $('#rec332464315').addClass('well-hidden')
            $('#rec317107713').addClass('well-hidden')
            $('#rec332450844').addClass('well-hidden')
            $('#rec317292231').addClass('well-hidden')
            $('#rec317028063').hide()
        }

    } catch (e) {
        console.log(e)
    }
}
