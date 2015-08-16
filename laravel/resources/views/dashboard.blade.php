@extends('layout')

@section('content')



    <div class="row">
        <div class="col-xs-12 col-md-12" id="welcome-text"><!-- ReactJS component: WelcomeText --></div>
    </div>



    <div id="visits-blocks-widget"><!-- ReactJS component: VisitsBlocksSet --></div>



    <div class="row">
        <div class="col-xs-6 col-md-6">
            <div class="widget" id="totalSalesGoals">
                <h2>Total Sales Goals</h2>
                <div>+</div>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                <div>Goal: $2,000,000</div>
                <div>Status: Ahead</div>
                <div>[baah chaat]</div>
            </div>
        </div>
        <div class="col-xs-6 col-md-6">
            <div class="widget">
                <h2>Earned Revenue Channels</h2>
                <div>+</div>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                <div id="div1"></div>
                Box Office
                $18,456
                Goal: $25,000
                Behind
                <div id="div2"></div>
                <div id="div3"></div>
                <div id="div4"></div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-6 col-md-6">
            <div class="widget">
                <h2>Total Membership Goals</h2>
                <div>+</div>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                <div>Membership Goal: #4,500</div>
                <div>Status: Behind</div>
                <div>[baah chaat]</div>
            </div>
        </div>
        <div class="col-xs-6 col-md-6">
            <div class="widget">
                <h2>Membership</h2>
                <div>+</div>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                <div id="div5"></div>
                <div id="div6"></div>
                <div id="div7"></div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-8 col-md-8">
            <div class="widget">
                <h2>Revenue</h2>
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                Big Graph
            </div>
        </div>
        <div class="col-xs-4 col-md-4">
            <div class="widget">
                <div>
                    Weather Bar
                    <div>+</div>
                </div>
                <h2>Earned Revenue</h2>
                <ul class="accordion">
                    <li>Notes</li>
                    <li>Box Office Total
                        <ul>
                            <li>down 4.5% $14,878 --&gt; $15,400
                                <ul>
                                    <li>Offline</li>
                                    <li>Online</li>
                                </ul>
                            </li>
                        </ul>
                    </li>  
                    <li>Groups
                        <ul>
                            <li>up 1.2% $9,765 --&gt; $8,765</li>
                        </ul>
                    </li>
                    <li>Cafe Total
                        <ul>
                            <li>up 1.2% $9,765 --&gt; $8,765</li>
                        </ul>
                    </li>
                    <li>Gift Store Total
                        <ul>
                            <li>up 1.9% $6,256 --&gt; $4,234</li>
                        </ul>
                    </li>  
                    <li>Membership
                        <ul>
                            <li>up 1.9% $6,256 --&gt; $4,234</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>



    <div id="members-blocks-widget"><!-- ReactJS component: MembersBlocksSet --></div>


   
@stop