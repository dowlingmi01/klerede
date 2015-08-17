@extends('layout')

@section('content')



    <div class="row">
        <div class="col-xs-12 col-md-12" id="welcome-text"><!-- ReactJS component: WelcomeText --></div>
    </div>



    <div id="visits-blocks-widget"><!-- ReactJS component: VisitsBlocksSet --></div>



    <div class="row">
        <div class="col-xs-6 col-md-6">
            <div class="widget" id="total-sales-goals">
                <h2>Total Sales Goals</h2>
                <div class="action-menu">+</div>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                <div class="clear">Goal: $2,000,000</div>
                <div>Status: Ahead</div>
                <div class="bar-meter"></div>
            </div>
        </div>
        <div class="col-xs-6 col-md-6">
            <div class="widget" id="earned-revenue-channels">
                <h2>Earned Revenue Channels</h2>
                <div class="action-menu">+</div>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                <div id="div1" class="clear"></div>
                <div>
                    Box Office
                    $18,456
                    Goal: $25,000
                    Behind
                </div>
                <div id="div2"></div>
                <div id="div3"></div>
                <div id="div4"></div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-6 col-md-6">
            <div class="widget" id="total-membership-goals">
                <h2>Total Membership Goals</h2>
                <div class="action-menu">+</div>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                <div class="clear">Membership Goal: #4,500</div>
                <div>Status: Behind</div>
                <div class="bar-meter"></div>
            </div>
        </div>
        <div class="col-xs-6 col-md-6">
            <div class="widget" id="membership">
                <h2>Membership</h2>
                <div class="action-menu">+</div>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                <div id="div5" class="clear"></div>
                <div id="div6"></div>
                <div id="div7"></div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-8 col-md-8">
            <div class="widget" id="revenue">
                <h2>Revenue</h2>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
            </div>
        </div>
        <div class="col-xs-4 col-md-4">
            <div class="widget" id="earned-revenue">
                <div class="weather-bar">
                    Weather Bar
                    <div class="action-menu">+</div>
                </div>
                <h2>Earned Revenue</h2>
                <ul class="accordion">
                    <li class="notes">Notes</li>
                    <li class="box-office">Box Office Total
                        <ul class="accordion">
                            <li>down 4.5% $14,878 --&gt; $15,400
                                <ul class="accordion">
                                    <li>Offline</li>
                                    <li>Online</li>
                                </ul>
                            </li>
                        </ul>
                    </li>  
                    <li class="groups">Groups
                        <ul class="accordion">
                            <li>up 1.2% $9,765 --&gt; $8,765</li>
                        </ul>
                    </li>
                    <li class="cafe">Cafe Total
                        <ul class="accordion">
                            <li>up 1.2% $9,765 --&gt; $8,765</li>
                        </ul>
                    </li>
                    <li class="gift-store">Gift Store Total
                        <ul class="accordion">
                            <li>up 1.9% $6,256 --&gt; $4,234</li>
                        </ul>
                    </li>  
                    <li class="membership">Membership
                        <ul class="accordion">
                            <li>up 1.9% $6,256 --&gt; $4,234</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>



    <div id="members-blocks-widget"><!-- ReactJS component: MembersBlocksSet --></div>


   
@stop