@extends('layout')

@section('content')



    <div class="row">
        <div class="col-xs-12 col-md-12" id="welcome-text"><!-- ReactJS component: WelcomeText --></div>
    </div>



    <div id="visits-blocks-widget"><!-- ReactJS component: VisitsBlocksSet --></div>



    <div class="row">
        <div class="col-xs-6 col-md-6">
            <div class="widget" id="totalSalesGoals">
                Total Sales Goals
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
            </div>
        </div>
        <div class="col-xs-6 col-md-6">
            <div class="widget">
                Earned Revenue Channels
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
                <div id="div1"></div>
                <div id="div2"></div>
                <div id="div3"></div>
                <div id="div4"></div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-6 col-md-6">
            <div class="widget">
                Total Membership Goals
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
            </div>
        </div>
        <div class="col-xs-6 col-md-6">
            <div class="widget">
                Membership
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
                Revenue
                <form>
                    <select class="form-control">
                        <option>XYZ</option>
                        <option>XYZ</option>
                    </select>
                </form>
            </div>
        </div>
        <div class="col-xs-4 col-md-4">
            <div class="widget">
                Revenue
            </div>
        </div>
    </div>



    <div id="members-blocks-widget"><!-- ReactJS component: MembersBlocksSet --></div>


   
@stop