import React from 'react';
import PaymentContext from '../context';
import { commaSeperatedAmount, CURRENCY_SYMBOL, TEXT_TRIM } from '../common';
import { homePageService } from '../jwt/_services/home-page-service';
import { Common } from '../common/common';

class DonationWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            donationWidget: this.props.donationWidget,
            latestDontaionText: '',
            donationFrequency: [],
            taxDedutionText: '',
            isldtVisible: false,
            isDonationFrequency: false,
            isTaxText: false,
            amoutOptions: [], //[5, 10, 20, 50, 100, 200],
            donationFrequencyOptions: [{ id: 1, value: 'One Time' }, { id: 2, value: 'Recurrent' }],
            regularFrequencyOptions: [],
            donationTypeOptions: [{ id: 1, value: 'Individual' }, { id: 2, value: 'Corporate' }],
            donationAmount: 0,
            frequency: 1,
            regularFrequency: 0,
            donationType: 1,
            blockTitle: '',
            blockSubTitle: '',
            decimalval: false,
            isDonateBtnEnabled: false,
        }

        this.refDonationAmount = React.createRef();
        this.refFixedDonationAmount = React.createRef();
        this.refFrequency = React.createRef();
        this.refRegularFrequencyOptions = React.createRef();
        this.refType = React.createRef();
        this.refDonateNowBtn = React.createRef();

        this.onFocusDonationAmount = this.onFocusDonationAmount.bind(this);
        this.onChangeDonationAmount = this.onChangeDonationAmount.bind(this);
        this.onBlurDonationAmount = this.onBlurDonationAmount.bind(this);
        this.setDonationAmountWidth = this.setDonationAmountWidth.bind(this);
        this.onClickFixedDonationAmount = this.onClickFixedDonationAmount.bind(this);
        this.onClickDonationFrequency = this.onClickDonationFrequency.bind(this);
        this.onClickRegularFrequencyOptions = this.onClickRegularFrequencyOptions.bind(this);
        this.onClickDonationType = this.onClickDonationType.bind(this);
        this.onClickDonateNow = this.onClickDonateNow.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    onFocusDonationAmount(e) {
        let ele = e.target;
        let val = ele.value.replace('$', '');

        if (!val) {
            ele.value = '$';
            this.refDonateNowBtn.current.setAttribute('disabled', 'disabled');
        } else {
            ele.classList.remove('is-invalid');
            ele.value = '$' + (val.indexOf(',') !== -1 ? val.replace(',', '') : val);
        }
    }

    onChangeDonationAmount(e) {
        let ele = e.target;        
        let val = parseFloat(ele.value.replace('$', '').match(/^[0-9]$/g).join(''));
        if (ele.value.includes('.')) {
            if (ele.value.split('.').length > 2) {
                // Remove . if more than 1 was found
                ele.value = ele.value.replace(/\.+$/, '')
            }
            else {
                // Restrict more than 2 digits after finding .
                if (ele.value.indexOf(".") > -1 && (ele.value.split('.')[1].length > 1)) {
                    ele.value = (ele.value.indexOf(".") >= 0) ?
                        (ele.value.substr(0, ele.value.indexOf(".")) + ele.value.substr(ele.value.indexOf("."), 3)) : ele.value;
                }
            }
        }

        if (ele.value.length > 8) {
            this.state.decimalval ? ele.setAttribute('maxlength', 11) : ele.setAttribute('maxlength', 8);
        }
        else {
            ele.setAttribute('maxlength', 8)
        }

        ele.value.toString().includes('.') ? ele.setAttribute('maxlength', 11) : ele.setAttribute('maxlength', 8);

        if (parseFloat(ele.value.replace('$', '').match(/[0-9]*\.[0-9][0-9]/g).join(''))) {
            val = parseFloat(ele.value.replace(/[$,]/gi, '').match(/[0-9]*\.[0-9][0-9]/g).join('')).toFixed(2)
        }
        else {
            if (parseFloat(ele.value.replace('$', '').match(/[0-9]*\.[0-9]/g).join(''))) {
                val = parseFloat(ele.value.replace(/[$,]/gi, '').match(/[0-9]*\.[0-9]/g).join(''));
            } else {
                val = parseInt(ele.value.replace(/[$,]/gi, '').match(/[0-9]/g).join(''));
            }
        }

        let context = this.context.PaymentContext;
        let eleFixedDonationAmount = this.refFixedDonationAmount.current;

        if (this.refDonationAmount.current.value !== '$' && this.state.isDonateBtnEnabled === true) {
            this.refDonationAmount.current.value.replace('$', '') < context[context.donationMethod].default.minAmount ? this.setState({ isDonateBtnEnabled: true }) : this.setState({ isDonateBtnEnabled: false });
        }
        else {
            this.setState({ isDonateBtnEnabled: true })
        }

        if (val >= context[context.donationMethod].default.minAmount) {
            // console.log("val : " , val);
            ele.value = this.refDonationAmount.current.value.replace(/[A-Za-z ~`!,@#%^&()_={}[\]:;<>+\/?-]/g, "");
            // let newval = commaSeperatedAmount(CURRENCY_SYMBOL, val);
            // console.log("ref value : " , commaSeperatedAmount(CURRENCY_SYMBOL, this.refDonationAmount.current.value.replace('$','')));
            // console.log("ele.value : " , ele.value);
            // console.log("newval : " , newval);
            // ele.value = commaSeperatedAmount(CURRENCY_SYMBOL, val.toString().replace('$',''))
            this.setDonationAmountWidth(ele);
            this.state.frequency === 2 && this.state.regularFrequency === 0 ? this.setState({ isDonateBtnEnabled: true }) : this.setState({ isDonateBtnEnabled: false });
            // this.refDonateNowBtn.current.removeAttribute('disabled');

            eleFixedDonationAmount.childNodes.forEach((item) => {
                if (parseFloat(item.innerText.trim().replace('$', '')) === val) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
            ele.value = commaSeperatedAmount(CURRENCY_SYMBOL, this.refDonationAmount.current.value.replace('$', ''));
        }
        else {
            ele.value = '$' + (val && val.toString() !== 'NaN' ? val : '');
            eleFixedDonationAmount.childNodes.forEach((item) => {
                item.classList.remove('selected');
            });
            this.refDonateNowBtn.current.setAttribute('disabled', 'disabled');
        }
    }

    onBlurDonationAmount(e) {
        let ele = e.target;
        let val = ele.value.replace('$', '');
        ele.value = commaSeperatedAmount('$', val);
    }

    setDonationAmountWidth(ele) {
        ele.style.width = ele.value.length * 25 + 'px';
    }

    onClickFixedDonationAmount(e) {
        let ele = e.target;
        let val = ele.innerText.trim();
        ele.parentNode.childNodes.forEach((ele) => ele.classList.remove('selected'));
        ele.classList.add('selected');
        ele.classList.remove('is-invalid');
        this.refDonationAmount.current.value = val;
        if (this.refDonationAmount.current.value !== '$') {
            this.state.frequency === 2 && this.state.regularFrequency === 0 ? this.setState({ isDonateBtnEnabled: true }) : this.setState({ isDonateBtnEnabled: false });
        }
        else {
            this.setState({ isDonateBtnEnabled: true })
        }
        this.setDonationAmountWidth(this.refDonationAmount.current);
        // this.refDonateNowBtn.current.removeAttribute('disabled');
        this.setState({ donationAmount: parseFloat(val.substr(1)) });
    }

    onClickDonationFrequency(e) {
        let ele = e.target;
        let dataType = parseInt(ele.getAttribute('data-type'));
        let context = this.context.PaymentContext;

        ele.parentNode.childNodes.forEach((ele) => ele.classList.remove('selected'));

        if (dataType !== 2) {
            if (this.refDonationAmount.current.value === '$' || this.refDonationAmount.current.value.replace('$', '') < context[context.donationMethod].default.minAmount) {
                this.setState({ isDonateBtnEnabled: true })
            } else {
                this.refDonationAmount.current.value.replace('$', '') < context[context.donationMethod].default.minAmount ? this.setState({ isDonateBtnEnabled: true }) : this.setState({ isDonateBtnEnabled: false })
            }
            this.refRegularFrequencyOptions.current.childNodes.forEach((ele) => ele.classList.remove('selected'));
        } else {
            let isRegularSelected = false;
            this.refRegularFrequencyOptions.current.childNodes.forEach((item) => {
                if (item.classList.contains('selected')) {
                    isRegularSelected = true
                }
            });
            isRegularSelected ? this.setState({ isDonateBtnEnabled: false }) : this.setState({ isDonateBtnEnabled: true })
        }

        this.setState({ frequency: dataType, regularFrequency: dataType !== 2 ? 0 : this.state.regularFrequency }); //ele.target.innerText
        ele.classList.add('selected');
    }

    onClickRegularFrequencyOptions(e) {
        let ele = e.target;
        let dataType = parseInt(ele.getAttribute('data-type'));
        let context = this.context.PaymentContext;

        ele.parentNode.childNodes.forEach((ele) => ele.classList.remove('selected'));

        if (dataType !== 0 && (this.refDonationAmount.current.value !== '$' && this.refDonationAmount.current.value.replace(/[^\w\s]/gi, '') >= context[context.donationMethod].default.minAmount)) {
            this.setState({ isDonateBtnEnabled: false })
        }
        else {
            this.setState({ isDonateBtnEnabled: true })
        }

        this.setState({ regularFrequency: dataType }); //ele.target.innerText
        ele.classList.add('selected');
    }

    onClickDonationType(e) {
        let ele = e.target;
        let dataType = parseInt(ele.getAttribute('data-type'));

        ele.parentNode.childNodes.forEach((ele) => ele.classList.remove('selected'));
        this.setState({ donationType: dataType }); //ele.target.innerText
        ele.classList.add('selected');
    }

    handleKeyPress(e) {

        let PaymentContext = this.context.PaymentContext;

        let val = e.target.value;
        val = parseInt(val.replace(/[$,]/gi, ''));
        if (val !== PaymentContext[PaymentContext.donationMethod].default.maxAmount && e.key === '.') {
            this.setState({ decimalval: true })
            e.target.setAttribute('maxlength', 11)
        }
    }

    onClickDonateNow(e) {
        let eleDonationAmount = this.refDonationAmount.current;
        let val = eleDonationAmount.value.trim().substr(1);
        val = val.indexOf(',') !== -1 ? val.replace(',', '') : val;
        let PaymentContext = this.context.PaymentContext;
        let method = PaymentContext.donationMethod;

        if (eleDonationAmount.value.trim() && val) {
            //eleDonationAmount.classList.remove('is-invalid');
            //this.setState({ donationAmount: parseFloat(val) });
            PaymentContext[method].donationAmount = parseFloat(val);

            this.refFrequency.current.childNodes.forEach(item => {
                if (item.classList.contains('selected')) {
                    PaymentContext[method].frequency = item.innerText.trim().toLowerCase();
                    return;
                }
            });

            this.refRegularFrequencyOptions.current.childNodes.forEach(item => {
                if (item.classList.contains('selected')) {
                    PaymentContext[method].partPayment = item.innerText.trim();
                    return;
                }
            });

            this.refType.current.childNodes.forEach(item => {
                if (item.classList.contains('selected')) {
                    PaymentContext[method].entity = item.innerText.trim().toLowerCase();
                    return;
                }
            });          
        } else {
            //eleDonationAmount.classList.add('is-invalid');
            eleDonationAmount.value = '';
            return false;
        }
        console.log(PaymentContext, "context");

        // change to default if moving from charity
        PaymentContext.cause.name = PaymentContext.cause.default.name;
    }

    configureDonationWidget() {
        this.setState({
            blockTitle: this.state.donationWidget.blockTitle,
            blockSubTitle: this.state.donationWidget.blockSubTitle
        })

        this.state.donationWidget.settings.map((data) => {
            switch (data.settingId) {
                case 7:
                    this.setState({
                        // latestDontaionText: data.settingValue,
                        isldtVisible: data.isVisible
                    })
                    break;
                case 8:
                    this.setState({
                        donationFrequency: data.settingValue,
                        isDonationFrequency: data.isVisible
                    })

                    break;
                case 9:
                    this.setState({
                        // taxDedutionText: data.settingValue,
                        isTaxText: data.isVisible
                    })
                    break;

                default:
                    break;
            }
        })
    }

    // handleKeyPress(e){
    //     if(e.target.value.length >= 8 && e.key === '.')
    //     {
    //         this.setState({decimalval : true})
    //         e.target.setAttribute('maxlength', 11)
    //     }
    // }

    getDonationWidget() {
        const appealId = 0;
        homePageService.getDonationWidgetData(appealId)
            .then(response => {
                if (typeof response === 'object') {
                    this.setState({
                        latestDontaionText: response.latestDonationText,
                        taxDedutionText: response.taxDeductibleText,
                        regularFrequencyOptions: response.recurringTypes,
                        amoutOptions: response.donationAmounts ? response.donationAmounts.slice(0, 6) : [],
                        // donationAmount: response.donationAmounts[response.defaultAmountPosition ? response.defaultAmountPosition : 0]
                        donationAmount: response.donationAmounts !== undefined ? response.donationAmounts[response.defaultAmountPosition ? response.defaultAmountPosition : 0] : []
                    });

                    if (Common.isValidField(this.refDonateNowBtn.current)) {
                        this.refDonateNowBtn.current.value = ''
                        this.refDonateNowBtn.current.setAttribute('disabled', 'disabled');
                    }

                    if (Common.isValidField(this.refFixedDonationAmount.current)) {
                        this.refFixedDonationAmount.current.childNodes.forEach((item) => {
                            if ((CURRENCY_SYMBOL + (parseFloat(response.donationAmounts[response.defaultAmountPosition ?? 0]) ?? 0)) === item.innerText) {
                                item.classList.add('selected');
                                this.refDonateNowBtn.current.removeAttribute('disabled');
                            } else {
                                item.classList.remove('selected');
                            }
                        });
                    }
                }
            });
    }

    componentDidMount() {  
        this.getDonationWidget();
        this.configureDonationWidget();
    }

    render() {
        return (
            <>
                {
                    this.state.amoutOptions.length ?
                        <div className="sec-donation form">
                            {this.state.isldtVisible && Common.isValidField(this.state.latestDontaionText) ? <div className="donation-to-user" title={this.state.latestDontaionText}>{TEXT_TRIM(this.state.latestDontaionText, 95)}</div> : ''}
                            <div className="question">{this.state.blockTitle}</div>
                            <div className="solution">{this.state.blockSubTitle}</div>
                            <div className="input-solution">
                                <input type="text" maxLength="8" ref={this.refDonationAmount} placeholder="$0" onKeyPress={this.handleKeyPress} defaultValue={this.state.donationAmount ? commaSeperatedAmount(CURRENCY_SYMBOL, this.state.donationAmount) : ''} onChange={this.onChangeDonationAmount} /* onFocus={this.onFocusDonationAmount} */ /* onBlur={this.onBlurDonationAmount} */ className="donation-value form-control" />
                                <div className="line"></div>
                            </div>
                            <div ref={this.refFixedDonationAmount} className="c-amount-options">
                                {
                                    this.state.amoutOptions.length ?
                                        this.state.amoutOptions.map((item, index) => {
                                            return <button type="button" onClick={this.onClickFixedDonationAmount} className="btn btn-light" key={index}>{commaSeperatedAmount(CURRENCY_SYMBOL, item)}</button>
                                        })
                                        :
                                        null
                                }
                            </div>

                            {this.state.regularFrequencyOptions.length <= 0 ? <> </> :
                                <div className="frequency">
                                    <div className="title">Donation Frequency</div>
                                    <div ref={this.refFrequency} className="type">
                                        {
                                            this.state.donationFrequencyOptions.map((item, index) => {
                                                return <button type="button" data-type={item.id} onClick={this.onClickDonationFrequency} className={"btn btn-light " + (parseInt(item.id) === 1 ? 'selected' : '')} key={index}>{item.value}</button>
                                            })
                                        }
                                    </div>
                                    <div className="type-regular-options">
                                        <div ref={this.refRegularFrequencyOptions} /* className={parseInt(this.state.frequency) !== 2 ? 'hide' : ''} */>
                                            {
                                                this.state.regularFrequencyOptions.map((item, index) => {
                                                    return <button type="button" data-type={item.id} onClick={this.onClickRegularFrequencyOptions} className="btn btn-light" key={index} disabled={this.state.frequency !== 2 ? true : false}>{item.title}</button>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="donation-type">
                                <div className="title">Donation Type</div>
                                <div ref={this.refType} className="type">
                                    {
                                        this.state.donationTypeOptions.map((item, index) => {
                                            return <button type="button" data-type={item.id} onClick={this.onClickDonationType} className={"btn btn-light " + (parseInt(item.id) === 1 ? 'selected' : '')} key={index}>{item.value}</button>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="c-btn-donate">
                                <button type="button" ref={this.refDonateNowBtn} disabled={this.state.isDonateBtnEnabled} onClick={this.onClickDonateNow} className="btn btn-dark h-45">Donate Now</button>
                            </div>
                            {
                                this.state.isTaxText ?
                                    <div className="note">
                                        {this.state.taxDedutionText}
                                    </div>
                                    :
                                    null
                            }
                        </div >
                        :
                        null
                }
            </>
        )
    }
}

export default (DonationWidget);