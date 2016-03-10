Set-StrictMode -Version latest

function Compress-GZip {
    <#
    .NOTES
        Copyright 2013 Robert Nees
        Licensed under the Apache License, Version 2.0 (the "License");
    .SYNOPSIS
        GZip Compress (.gz)
    .DESCRIPTION
        A buffered GZip (.gz) Compress function that support pipelined input
    .Example
        ls .\NotCompressFile.xml | Compress-GZip -Verbose -WhatIf
    .Example
        Compress-GZip -FullName NotCompressFile.xml -NewName Compressed.xml.funkyextension
    .LINK
        http://sushihangover.blogspot.com
    .LINK
        https://github.com/sushihangover
    #>
    [cmdletbinding(SupportsShouldProcess=$True,ConfirmImpact="Low")]
    param (
        [Alias("PSPath")][parameter(mandatory=$true,ValueFromPipeline=$true,ValueFromPipelineByPropertyName=$true)][string]$FullName,
        [Alias("NewName")][parameter(mandatory=$false,ValueFromPipeline=$false,ValueFromPipelineByPropertyName=$true)][string]$GZipPath,
        [parameter(mandatory=$false)][switch]$Force
    )
    Process {
        $_BufferSize = 1024 * 8
        if (Test-Path -Path $FullName -PathType Leaf) {
            Write-Verbose "Reading from: $FullName"
            if ($GZipPath.Length -eq 0) {
                $tmpPath = ls -Path $FullName
                $GZipPath = Join-Path -Path ($tmpPath.DirectoryName) -ChildPath ($tmpPath.Name + '.gz')
            }
            if (Test-Path -Path $GZipPath -PathType Leaf -IsValid) {
                Write-Verbose "Compressing to: $GZipPath"
            } else {
                Write-Error -Message "$FullName is not a valid path/file"
                return
            }
        } else {
            Write-Error -Message "$GZipPath does not exist"
            return
        }
        if (Test-Path -Path $GZipPath -PathType Leaf) {
            If ($Force.IsPresent) {
                if ($pscmdlet.ShouldProcess("Overwrite Existing File @ $GZipPath")) {
                    Touch-File $GZipPath
                }
            }
        }
        if ($pscmdlet.ShouldProcess("Creating Compress File @ $GZipPath")) {
            Write-Verbose "Opening streams and file to save compressed version to..."
            $input = New-Object System.IO.FileStream (ls -path $FullName).FullName, ([IO.FileMode]::Open), ([IO.FileAccess]::Read), ([IO.FileShare]::Read);
            $output = New-Object System.IO.FileStream (ls -path $GZipPath).FullName, ([IO.FileMode]::Create), ([IO.FileAccess]::Write), ([IO.FileShare]::None)
            $gzipStream = New-Object System.IO.Compression.GzipStream $output, ([IO.Compression.CompressionMode]::Compress)
            try {
                $buffer = New-Object byte[]($_BufferSize);
                while ($true) {
                    $read = $input.Read($buffer, 0, ($_BufferSize))
                    if ($read -le 0) {
                        break;
                    }
                    $gzipStream.Write($buffer, 0, $read)
                }
            }
            finally {
                Write-Verbose "Closing streams and newly compressed file"
                $gzipStream.Close();
                $output.Close();
                $input.Close();
            }
        }
    }
}
