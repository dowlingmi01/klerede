. "$PSScriptRoot\util.ps1"

$database = 'Galaxy1'
$venue_id = 1588
$baseUrl = 'http://local.kl/api/v1'
$queryUrl = '?XDEBUG_SESSION_START=session_name'
$urlQuery = "$baseUrl/import/query$queryUrl"
$urlUpload = "$baseUrl/import/query-result$queryUrl"

function Get-Query($venue_id, $last_query_id) {
    Invoke-RestMethod -Uri $urlQuery -Body @{"venue_id"=$venue_id; "last_query_id"=$last_query_id} -Verbose
}
function Run-Query($query_text, $file_name) {
    & bcp $query_text queryout $file_name -cT -d $database
}
function Upload-Result($url, $file_name) {
    $wc = new-object System.Net.WebClient
    [System.Text.Encoding]::ASCII.GetString($wc.UploadFile( $url, $file_name )) | ConvertFrom-Json
}

$last_query_id = 0
$resultQ = Get-Query $venue_id $last_query_id

while($resultQ.query_id -gt 0) {
    $fileName = [System.IO.Path]::GetTempFileName()
    Run-Query $resultQ.query_text $fileName

    $fileNameComp = [System.IO.Path]::GetTempFileName()
    Compress-GZip $fileName $fileNameComp
    Remove-Item $fileName

    Upload-Result "$urlUpload&query_id=$($resultQ.query_id)" $fileNameComp
    Remove-Item $fileNameComp

    $last_query_id = $resultQ.query_id
    $resultQ = Get-Query $venue_id $last_query_id
}
