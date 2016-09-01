@extends('layout')

@section('content')

    <div id="reporting-on"><!-- ReactJS component: ReportingOn --></div>

    <div id="visits-blocks-widget"><!-- ReactJS component: VisitsBlocksSet --></div>

    <div class="row">
        <div id="sales-goals-widget" class="col-xs-6 col-md-6"><!-- ReactJS component: SalesGoals --></div>
        <div id="membership-goals-widget" class="col-xs-6 col-md-6"><!-- ReactJS component: MembershipGoals --></div>
    </div>
    

    <div id="revenue-row-widget2"><!-- ReactJS component: Revenue --></div>


    <div id="members-blocks-widget"><!-- ReactJS component: MembersBlocksSet --></div>

@stop

@section('scripts')
<script type="text/javascript">

loadUser();

</script>
@stop