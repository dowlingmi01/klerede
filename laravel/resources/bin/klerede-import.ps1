. "$PSScriptRoot\util.ps1"

function Get-Query($venue_id, $last_query_id) {
    Invoke-RestMethod -Uri $url_query -Body @{"venue_id"=$venue_id; "last_query_id"=$last_query_id} -Verbose
}
function Run-Query($query_text, $file_name) {
    if($cfg_sql_auth -eq 'trusted') {
        & bcp $query_text queryout $file_name -c -d $cfg_sql_database -S $cfg_sql_server -T
    } else {
        & bcp $query_text queryout $file_name -c -d $cfg_sql_database -S $cfg_sql_server -U $cfg_sql_user -P $cfg_sql_password
    }
}
function Upload-Result($url, $file_name) {
    $wc = new-object System.Net.WebClient
    [System.Text.Encoding]::ASCII.GetString($wc.UploadFile( $url, $file_name )) | ConvertFrom-Json
}

$conf_file = 'klerede-import.ini'

# Read the contents of the configuration file into the variables.
Try {
	Get-Content $conf_file -ErrorAction Stop | Foreach-Object {
		$var = $_.Split('=')
		Set-Variable -Name cfg_$($var[0]) -Value $var[1]
	}
} Catch {
	$message = "Could not read configuration file $conf_file`r`n"
	$message = $message + $_.Exception.Message
	$message = $message + $_.Exception.StackTrace
	Write-Error $message
    exit 1
}

$url_query = "$cfg_base_url/api/v1/import/query"
$url_upload = "$cfg_base_url/api/v1/import/query-result"

$last_query_id = 0
$resultQ = Get-Query $cfg_venue_id $last_query_id

while($resultQ.query_id -gt 0) {
    $fileName = [System.IO.Path]::GetTempFileName()
    Run-Query $resultQ.query_text $fileName

    $fileNameComp = [System.IO.Path]::GetTempFileName()
    Compress-GZip $fileName $fileNameComp
    Remove-Item $fileName

    Upload-Result "${url_upload}?query_id=$($resultQ.query_id)" $fileNameComp
    Remove-Item $fileNameComp

    $last_query_id = $resultQ.query_id
    $resultQ = Get-Query $cfg_venue_id $last_query_id
}
