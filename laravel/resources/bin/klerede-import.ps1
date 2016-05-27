param([switch]$test = $false)

. "$PSScriptRoot\util.ps1"

function Write-Message($message) {
	Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $message"
}

function Fail($message, $error) {
	$message = 'ERROR: ' + $message + "`r`n" + $(Out-String -InputObject $error)
	Write-Message $message
    exit 1
}
function Get-Query($venue_id, $last_query_id) {
	Try {
		Invoke-RestMethod -Uri $url_query -Body @{"venue_id"=$venue_id; "last_query_id"=$last_query_id} -Verbose
	} Catch {
		Fail "Unable to get url $url_query" $_
	}
}
function Run-Query($query_text, $file_name) {
    if($cfg_sql_auth -eq 'trusted') {
        & bcp $query_text queryout $file_name -c -d $cfg_sql_database -S $cfg_sql_server -T
    } else {
        & bcp $query_text queryout $file_name -c -d $cfg_sql_database -S $cfg_sql_server -U $cfg_sql_user -P $cfg_sql_password
    }
}
function Upload-Result($url, $file_name) {
	Try {
		$wc = new-object System.Net.WebClient
		[System.Text.Encoding]::ASCII.GetString($wc.UploadFile( $url, $file_name )) | ConvertFrom-Json
	} Catch {
		Fail "Unable to upload result to url $url" $_
	}
}

$conf_file = "$PSScriptRoot\klerede-import.ini"

# Read the contents of the configuration file into the variables.
Try {
	Get-Content $conf_file -ErrorAction Stop | Foreach-Object {
		$var = $_.Split('=')
		Set-Variable -Name cfg_$($var[0]) -Value $var[1]
	}
} Catch {
	Fail "Could not read configuration file $conf_file" $_
}

Try {
	if($test) {
		$testFN = [System.IO.Path]::GetTempFileName()
		Run-Query 'SELECT 12345' $testFN
		$testRes = Get-Content $testFN
		Remove-Item $testFN
		if($testRes -ne '12345') {
			Fail "Database test failed"
		}
		Write-Message "Database test OK"
		exit 0
	}
	$url_query = "$cfg_base_url/api/v1/import/query"
	$url_upload = "$cfg_base_url/api/v1/import/query-result"

	$last_query_id = 0
	$resultQ = Get-Query $cfg_venue_id $last_query_id

	while($resultQ.query_id -gt 0) {
		Write-Host "--------------------------------------------------"
		Write-Message "Got query $($resultQ.query_id)"

		$fileName = [System.IO.Path]::GetTempFileName()
		Run-Query $resultQ.query_text $fileName

		Write-Host ""

		$fileNameComp = [System.IO.Path]::GetTempFileName()
		Compress-GZip $fileName $fileNameComp
		Remove-Item $fileName

		Write-Message "Uploading results"
		$result = Upload-Result "${url_upload}?query_id=$($resultQ.query_id)" $fileNameComp
		Remove-Item $fileNameComp

		Write-Host "--------------------------------------------------"
		$last_query_id = $resultQ.query_id
		$resultQ = Get-Query $cfg_venue_id $last_query_id
	}
} Catch {
	Fail "" $_
}
