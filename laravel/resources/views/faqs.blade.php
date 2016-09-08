@extends('layout')

@section('content')


	<div class="row">
        <div class="col-xs-12 col-md-12">
            <h2 class="page-title">FAQs</h2>
        </div>
    </div>

<div class="page faqs-page">

	<div class="content-box">
		<div class="breadcrumbs"> <a href='dashboard'>Dashboard</a> | FAQs </div>

		<div class="browse">
			<h4>Browse by topic</h4>
			<div class="topics">
                <div>
                	<ul>
                        <li><div class="svgcaret"></div><div class="faq-title">What’s the purpose of the dashboard?</div>
<ul>                        <li>Based on numerous conversations with managers, marketers and operators of cultural attractions and through several rounds of prototyping, we have developed an easy-to-use dashboard to give you a daily window into your business. Our goal was to deliver metrics that are curated specifically to provide insights that inform your decision-making and measure your business strategies. </li>
</ul>
                        </li>

                        <li><div class="svgcaret"></div><div class="faq-title">How do we do it?</div>
<ul>                        <li>We turn the “firehose” of data being generated every day across your institution into the metrics that truly matter to helping you manage your business. We do this by aggregating point-of-sale data across all the places where your visitors choose to transact. We have deployed <em>Baton</em>, which is an application that we have developed to sit on top of your databases and allow us to direct queries securely through the cloud. That data is brought into our data warehouse where it is cleansed and made ready to be displayed through <em>Relay</em>.</li>
</ul>
                        </li>

                        <li><div class="svgcaret"></div><div class="faq-title">Current Features</div>
                        <ul>                        <li>We have designed the dashboard to be very easy to use so everyone at your institution can use it. Getting everyone on a common data language is the first step towards truly leveraging the power of big data. At its core, the dashboard delivers insights on attendance and box office transactions, gift store purchases, café/restaurant transactions and membership behaviors. To help you make sense of the data, we have built a variety of contextual metrics – <em>how did yesterday’s general admission sales compare to the same day last year or the average over the last year? We recognize that there are certain events to which your business is more susceptible</em> – weather, for instance. So, we’ve also integrated weather data to help you identify the extent to which bad (or good) weather days impact visitor behavior. We will be adding other features along the way – see Product Roadmap Features.</li>
                        </ul></li>
               		
                		<li><div class="svgcaret"></div><div class="faq-title">Can I change the design of the dashboard?</div>
                			<ul>
                				<li>Not exactly. Meaning, we have consciously chosen to curate the dashboard for you. We did this for a few reasons. One, it is how we can offer data aggregation to you at a very reasonable price point; two, and perhaps even more importantly, we want <em>Relay</em> to be your “Virtual Data Scientist.” What does that mean? In our travels throughout the cultural institution landscape, one thing we heard consistently was the importance of data, but the pervasive uncertainty of how to use it. We liken it to handing a non-artist an empty canvas and a set of paints – some might be comfortable painting a picture, but the vast majority will stare at it and ultimately take no action. So, we decided to help paint the picture for you. Instead of hiring IT and data analyst staff, we are evolving <em>Relay</em> to play that data analyst role for you initially, and eventually be your go-to data scientist. This is where you can <strong>influence</strong> the growth and development of <em>Relay</em>. We are agile developers, which is just a fancy way of saying we are reactive to your use of the dashboard. We want to hear from you about what you like, don’t like and what features would make the dashboard more useful for you. If your request is not too uniquely custom, we can include it as part of our development cycles at <em>no cost to you</em>. We may have already included it as part of our product roadmap (Product Roadmap Features). If, however, there is a custom feature that you just can’t live without, we can discuss how to include it for a nominal fee.</li>
                			</ul>
                        </li>
                            <li><div class="svgcaret"></div><div class="faq-title">Product Roadmap Features</div>
<ul>                        <li><strong>Sales forecast data</strong>. The data science team at Klerede has been hard at work analyzing attendance and retail data across hundreds of cultural attractions. That exploration has resulted in the development of a predictive model that enables us to deliver sales forecasts. Provided that we have at least 12 months of your historical attendance data, we can deliver projections that can pre-populate the “Goals” section and provide a 7-day outlook on the “Earned Revenue” chart. This feature will be available by the end of 2016.</li>
                        <li><strong>Weather forecast data</strong>. While looking backward is helpful to understand how weather impacted your business, we also know how valuable it would be to predict future events to better inform your resource planning. Towards the end of 2016, we plan to introduce 7-day outlook data and are working to deploy more sophisticated forecasts that will alert you to potential weather risks.</li>
                        <li><strong>Annotations</strong>. While we are evolving <em>Relay</em> to pull data in from a variety of sources, there are just things that happen that need to be recorded to explain anomalies. For instance, there could be a power outage or the President decided to visit and the streets around your venue were shut down for a few hours. These are events that can impact your total box office gate. It would be good to have a way of recording them so when analyzing past performance you can put the results in the proper perspective. That is what we intend to deliver to you – an easy way to keep track of those things and the nuances that are unique to you.</li>
                        <li><strong>Dynamic Calendar</strong>. Sometimes you just might want to look at how you’ve done over a 17-day period (we don’t judge). In that case, you will need a calendar function that allows you to select a date range to review. The one thing that really complicates this is how to make comparisons – that pesky Julian calendar! As a result, some use a “retailer” method, which measures each quarter on a 4-week/4-week/5-week basis, while others have just thrown up their arms in frustration. We</li>
</ul>
                            </li>
                        <li><div class="svgcaret"></div><div class="faq-title">How can I let you know what features I’d like to see?</div>
<ul>                        <li>We definitely want to hear from you. Either shoot us an email at <a href="mailto:support@klerede.com">support@klerede.com</a> or use our bug tracking software to communicate your requests.</li></ul>
                        </li>

                        <li><div class="svgcaret"></div><div class="faq-title">What are the boxes at the top of the page?</div>
 <ul>                       <li><strong>What data is being reported?</strong> The boxes at the top of the page are what we are calling the “Visitor Boxes.” These are designed to provide you with a daily snapshot of box office and attendance data. We have curated this to include views of total visits, total gate, general admission, group visitation and member visits.</li>
                         <li><strong>Is that all that can be reported?</strong> No. Any attendance related data that your ticketing system is capturing could be reported through this view.</li>
 </ul>
                        
                        </li>
                        <li><div class="svgcaret"></div><div class="faq-title">What is the dropdown above the boxes at the top of the page?</div>
 <ul>                       <li>These are filters that help to contextual the data you are viewing. It is helpful to know whether a particular day’s total gate or member visits are above or below expectations. You may have an intuitive sense of this, but we want to provide you with some other contextual comparisons to help you confirm your intuition. Right now, we are showing you how the day’s results compare to the trend over the last two days, the same day last year (e.g. Monday to Monday) and the average over the last year. We will also be introducing other benchmarks as the data warrants – such as quarterly averages, comparisons to projections, etc. </li>
 </ul>
                        
                        </li>
                        <li><div class="svgcaret"></div><div class="faq-title">Sales & Member Goals</div>
<ul>                        <li><strong>How do I set goals?</strong> If you are an “Owner” or “Admin” accountholder, you will have the ability to create goals in the system. Simply click on the “+” button in the upper right-hand corner of the “Goals” section and click “Edit”. This will take you to a page with forms to input goals on a monthly basis. </li>
                        <li><strong>What if I want to upload daily or weekly goals?</strong> Well, that would put you far ahead of the rest of your cohorts! At the moment, we do not have an automatic upload function, but you can send us your numbers in a .csv file or an excel spreadsheet and we would be happy to upload them for you. Just contact us at <a href="mailto:support@klerede.com">support@klerede.com</a></li>
</ul>
                        </li>
                        <li><div class="svgcaret"></div><div class="faq-title">Earned Revenue Chart</div>
<ul>                        <li><strong>How do I use this?</strong> The Earned Revenue section is very robust and enables you to analyze your data through a variety of different lenses and time periods. You can look at data on a Weekly, Monthly or Quarterly basis and see how they compare to relevant time periods. Just select a time period through the calendar and use the dropdown to select “Week containing,” “Month containing,” or “Quarter containing”. </li>
                        <li><strong>What do the column charts tell me?</strong> In the Weekly or Monthly view, you can rollover any day and see the results across all your revenue channels and also be shown what the weather was for that day at 10am and 4pm – both temperature and any weather-related activity (e.g. rain, snow, etc.). Why 10am and 4pm? We arbitrarily chose those timeframes as representative of morning and afternoon weather. We capture weather on an hourly basis, so we can always adjust to your particular preference. For the Quarterly view you can see the sales totals for each week. </li>
                        <li><strong>What are the colored circles in the upper right-hand section of the graph?</strong> These are toggle switches that enable you to “deselect” any of the revenue channels being reported. Perhaps you want to isolate one channel or you want to view just a couple. Just above those toggle switches, you will also notice a dropdown, which will enable you to view member versus non-member data. </li>
                        <li><strong>What do the DOLLARS and PER CAP on the graph mean?</strong> In the upper left-hand section of the graph, you will notice two options “DOLLARS” and “PER CAP”. The graph defaults to DOLLARS, which displays the sales amounts for the reporting periods. By selecting PER CAP, you can view per capita sales i.e. total $ sales divided by total attendance. This metric is extremely helpful in understanding how well each touch point (e.g. café, gift store, etc.) performed in generating transactions with visitors. It also helps to provide insights into the consumer & donor types that visit your venue.</li>
                        <li><strong>What is the “Show Details” tab at the bottom of the graph?</strong> By clicking on this, you will trigger an accordion that displays some additional detail for your analysis. This section will show you whether you performed above or below comparison periods. Through the use of up/down arrows you will quickly be able to see if your results compare favorably or not, and it is measured on an absolute and percentage basis. There is a dropdown in the upper right-hand section that will let you compare Last Week and a rolling 13-Week Average for the Weekly view; Last Month and Same Month Last Year for the Monthly view; and Last Quarter and Same Quarter Last Year for the Quarterly View.</li>
</ul>

                        </li>
                        <li><div class="svgcaret"></div><div class="faq-title">What is “NaN%”</div>
<ul>                        <li>You may see this from time to time and it just means that you likely trying to compare data to a prior period that isn’t contained in the database. This is currently a bug we are fixing, so if you’ve come across it, please let us know by contacting [      ] or click on this link to be taken to our bug tracking system.</li>
</ul>
                        
                        </li>
                        <li><div class="svgcaret"></div><div class="faq-title">What are the boxes at the bottom of the dashboard?</div>
<ul>                        <li><strong>What data is being reported?</strong> These are what we call our “Curated Metric Boxes.” This is where we get to curate useful metrics to help you better understand visitor and member behaviors. It is also designed to help you measure your marketing and operating strategies with metrics that everyone in your organization can get behind. The Member Conversion box tells you what percentage of visitors to the venue were converted to membership on that particular day; Frequency and Recency are great metrics to help you understand when was the last time a member visited and how frequently they’ve come in the last twelve months; Capture Rate helps you understand what percentage of visitors bought something at the gift store; and Per Cap tells you how much revenue was generated per visitor to the venue at the gift store for that particular day.</li>
                        <li><strong>Is this the only data that I can see?</strong> No. Similar to the Visitor Boxes, we have carefully curated the metrics that we believe will matter to your business. However, if you’ve set up ways to further capture member behaviors at your venue – such as card swipes at the different points of sale – we can incorporate those into our analytics.</li>
                        <li><strong>What is the dropdown above the boxes at the bottom?</strong> These are filters that will help you to contextualize the data based on comparisons to the average over the last two days, the same day last year (e.g. Monday to Monday), or the average over the last year.</li>
</ul>                        
                        
                        </li>
                	</ul>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="page footer-box faqs-page">
	<h4 class="inline-block">Need our assistance?</h4>
    <div class="form-group inline-block" data-reactid=".0.0.1.1.1.7"> <a class="btn inline-block" href="mailto:support@klerede.com" >CONTACT US</a></div>
</div>

@stop

@section('scripts')
<script type="text/javascript">
$(".topics > div > ul > li .svgcaret, .topics > div > ul > li .faq-title").on("click", function (event) {
    $(event.currentTarget).parent().toggleClass("active");
});
loadUser();
</script>
@stop
