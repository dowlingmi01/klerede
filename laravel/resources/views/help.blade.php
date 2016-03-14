@extends('layout')

@section('content')


	<div class="row">
        <div class="col-xs-12 col-md-12">
            <h2 class="page-title">Help topics</h2>
            <div id="time-date"><!-- ReactJS component: TimeDate --></div>
        </div>
    </div>



<div class="page help-page">

	<div class="content-box">
		<div class="breadcrumbs"> Help > Search Results </div>

		<div class="search-container">
		    <form role="form">
		        <div class="row">
		            <div class="form-group">
		                <input class="form-control input-lg" type="text" placeholder="Search by help topic, keywords, or phrases">
		            </div>
		        </div>
		    </form>
		</div><!-- .search-container -->

		<div class="browse">
			<h4>Browse by topic</h4>
			<div class="topics">
				<div class="row">
					<div class="col-md-6">
						<ul>
							<li>Manage your account</li>
							<li>Fees & billing</li>
							<li>Resolve a problem</li>
							<li>Technical issues</li>
								<ul>
									<li>Doesn't work</li>
									<li>Numbers are off</li>
									<li>How do I edit goals</li>
								</ul>
							<li>User management</li>
						</ul>
					</div><!-- .col-md-6 -->	
					<div class="col-md-6">				
						<ul>
							<li>Manage your account</li>
							<li>Fees & billing</li>
							<li>Technical issues</li>
						</ul>
					</div><!-- .col-md-6 -->
				</div><!-- .row -->
			</div><!-- .topics -->	
		</div><!-- .browse -->	

	</div> <!-- .content-box -->

</div> <!--  #help-page  -->

<div class="page footer-box help-page">
	<h4>Need our assistance?<h4>
	<button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
		CONTACT US
	</button>
</div>




@stop