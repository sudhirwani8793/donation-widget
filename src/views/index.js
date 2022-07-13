import React from 'react';
// import Banner from '../section/banner/banner';
// import '../assets/css/slick.min.css';
// import '../assets/css/slick-theme.min.css';
import DonationWidget from './donation-widget';

class NGS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blockSettings: [],
            bannerDetails: [],
            is_banner: false,
            is_donation_widget: false,
            // headerData: [],
            // bannerData: [],
            donationWidgetData: []
        }
    }

    componentDidMount() {
        console.log(this.props.value, "props");
        const HomePage = this.props.value;

        this.setState({
            blockSettings: this.props.value.blockDetails,
            bannerDetails: this.props.value.bannerDetails,
        })
        console.log(this.state.blockDetails, this.state.bannerDetails);

        this.homePageConfiguration(HomePage);

    }

    homePageConfiguration(HomePage) {
        HomePage.blockDetails.map((blockSetting) => {
            var homePageBlocks = [];

            switch (blockSetting.blockId) {
                case 3:
                    this.setState({ is_banner: blockSetting.isEnabled });
                    break;
                case 4:
                    this.setState({ is_donation_widget: blockSetting.isEnabled, donationWidgetData: blockSetting });
                    break;
                default:
                    break;
            }
        })
    }

    render() {
        return (
            <div className="landing-page">
                {this.state.is_banner && this.state.donationWidgetData.isEnabled ?
                    // <Banner bannerDetails={this.state.bannerDetails} donationWidgetData={this.state.donationWidgetData}></Banner>

                    <div id="HOME" className="sec-banner pos-rel">
                        <div className="container pos-rel">
                            <div className="c-donation-widget"><DonationWidget donationWidget={this.state.donationWidgetData}></DonationWidget></div>
                        </div>

                    </div>

                    : null}

            </div>
        )
    }
}

export default NGS;