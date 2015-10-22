@extends('layout')

@section('content')

    <div id="welcome-text"><!-- ReactJS component: WelcomeText --></div>

    <h2>Goal Setting</h2>
    <p>Enter monthly goals by channel to populate the dashboard</p>
    <p>Goal in Dollars</p>
    <form id="filter-revenue-week">
        Box Office: <input type="text" value="$000,000" />
        By Month:
        Jan: <input type="text" value="$0" />
        Feb: <input type="text" value="$0" />
        Mar: <input type="text" value="$0" />
        Apr: <input type="text" value="$0" />
        May: <input type="text" value="$0" />
        Jun: <input type="text" value="$0" />
        Jul: <input type="text" value="$0" />
        Aug: <input type="text" value="$0" />
        Sep: <input type="text" value="$0" />
        Oct: <input type="text" value="$0" />
        Nov: <input type="text" value="$0" />
        Dec: <input type="text" value="$0" />
        Cafe: <input type="text" value="$000,000" />
        Total Membership #: <input type="text" value="000,000" />
        Family #: <input type="text" value="000,000" />
        Individual #: <input type="text" value="000,000" />
        Donor #: <input type="text" value="000,000" />
        Total Membership $: <input type="text" value="$000,000" />
        Family $: <input type="text" value="$000,000" />
        Individual $: <input type="text" value="$000,000" />
        Donor $: <input type="text" value="$000,000" />
    </form>

@stop