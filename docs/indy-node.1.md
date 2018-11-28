# [Hyperledger indy](https://github.com/hyperledger/indy-node/blob/stable/getting-started.md)

## What Indy is, and Why it Matters
Indy 提供自我主權的管理的工具來管理個人的 隱私＋安全＋個人身份，透過Indy 更可衍生出更多應用
如 合約連結，註銷，新的payment流程，資產與文件管理，創意形式的託管，以及其他技術的整合應用
Indy是建構在開源的共享帳簿技術上，並使用企業級的加密技術保護帳本，並結合最佳實踐的秘鑰管理與網路安全，創建一個強健系統。

## What We’ll Cover
本篇內容主要介紹基本的indy概念以及其背後的原理。以下內容透過一個故事來解釋Indy
Alice畢業於虛擬Faber College，想透過成績單，申請在 虛擬Acme Corp工作，一旦他真的獲得工作之後，
她想透過他的工作證明來作信用貸款，用來購買車子。
今天世界上所需的各種身份和信任互動都是混亂的。 很慢且侵犯了隱私，也容易受到欺詐。 以下展示Indy是如何實現並解決的。

## Alice Gets a Transcript
Faber College在帳本上屬於trust anchor，trust anchor屬於已知可信任的個人或是組織。
Alice使用新的可攜式的，且獨立於以往的身份來接受成績證明。屬於任何人都無法撤銷且自我主權的身份。
Alice將使用Indy應用程式來表達自己的自主身份，任何人都無法撤銷。
當Alice點擊下載成績證明時，下載.indy文件並與indy應用程序相關聯。
這將允許他在分佈帳本上建立安全通道與其他第三方進行溝通。

## Install Indy, Using the Indy CLI
安裝Docker indy 並透過 cli執行。
$ prompt ALICE，來操作Alice這個角色
$ new wallet Alice 創建新錢包給Alice
$ status 顯示基本資訊

## Evaluate a Connection Request
為方便演釋，cli 以預先安裝了 Faber College 邀請request，
```
$ show sample/faber-request.indy // 顯示Faber College 邀請request內容
$ load sample/faber-request.indy // 顯示顯示Faber發起connection
$ show connection Faber 	     // 顯示與Faber connection的詳細訊息
```
```
Name: Faber College  		// 連接名稱
DID: not yet assigned		// 唯一的去中心化身份識別符，由Faber College發出驗證Alice在Faber College的成績單
Trust anchor: Faber College (not yet written to Indy)			// 此DID的Trust anchor發行方
Verification key: <empty>			// 驗證公鑰，以驗證是屬於Alice
Signing key: <hidden>					// 簽署此connection所使用的私鑰
Remote: FuN98eH2eZybECWkofW6A9BKJxxnTatBCopfUiNxo6ZB			// Alice用此DID來識別Faber College
Remote Verification key: <unknown, waiting for sync>			// Remote 所對應之公鑰
Remote endpoint: <unknown, waiting for sync>					    // 遠端端點
Request nonce: b1134a647eb818069c089e7694f63e6d					  // 由Faber College產生的隨機數用以識別唯一的connection
Request status: not verified, remote verkey unknown				// Request 狀態
Last synced: <this connection has not yet been synchronized>	//上次同步的時間
```

## Accept a Connection Request
```
$ connect sandbox				      // 連接至sandbox測試環境
$ accept request from Faber 	// 接受Faber連線請求，並使用Alice的key進行簽章，並將簽名後的數據傳甕製Faber College，
```
以驗證簽名，並紀錄至帳本中
驗證成功後remote verification key, remote endpoint,DID and verification key 將會被更新。

## Test Secure Interaction
```
$ ping Faber  	// 連接完成後可進行測試來驗證與faber College之間的互動
```

## Inspect the Claim
Available Claim(s): Transcript 		
在驗證完後，其驗證connection會多上此新的聲明欄位，並標註為Transcript的聲明Claim由發行方(Faber College)所發行，任何人皆可為發行方，包含自己

## show claim Transcript 			
顯示更多聲明細節。
其中聲明的狀態顯示未發行
```
$ request claim Transcript      // 透過此指令要求聲明
```
Status: available (not yet issued)  --->  Status: 2017-05-01 12:32:17.497455

## Apply for a Job
```
$ show sample/acme-job-application.indy 	//	顯示Acme Corp connection request內容
```
其中包含一個欄位 proof request 	證明請求，其格式如下，顯示Acme Corp connection所要求的內容
```
{
    "name": "Job-Application",
    "version": "0.2",
    "attributes": {
        "first_name": "string",
        "last_name": "string",
        "phone_number": "string",
        "degree": "string",
        "status": "string",
        "ssn": "string"
    },
    "verifiableAttributes": ["degree", "status", "ssn"]
}
```

透過以下操作，Alice建立與Acme Corp.的連線
```
$ load sample/acme-job-application.indy  	// 載入工作聲請聲明
$ accept request from Acme 								// 接受工作聲請聲明，其中包含Job-Application 證明需求
$ show proof request Job-Application 		  //	顯示證明需求內容，其中 Alice只有一項聲明符合此證明需求，其餘的資訊
```
Alice可透過以下指令填寫提供
```
$ set first_name to Alice
$ set last_name to Garcia
$ set phone_number to 123-456-7890
$ send proof Job-Application to Acme 		// 透過此指令提交工作證明
```

當證明被 Acme Corp接受後，可透過以下指令查看與Corp之間的連線訊息
```
$ show connection Acme
```

## Apply for a Loan
Alice 接著要聲請貸款，其流程與上述相同，提出工作聲明來聲請貸款
```
$ show claim Job-Certificate 		  // 檢查工作聲明
$ request claim Job-Certificate	 	// 要求工作聲明
```
聲明狀態	available(not yet issued)  -->  2017-05-01 16:53:53.742695
```
$ load sample/thrift-loan-application.indy 				// 載入貸款聲明
$ accept request from Thrift 							        // 接受銀行貸款聲明, 其中包含兩個證明需求 Loan-Application-Basic + Loan-Application-KYC
$ show proof request Loan-Application-Basic 			// 顯示基本貸款證明需求
$ send proof Loan-Application-Basic to Thrift Bank		// 提交貸款證明需求，其中只需包含最小量的個人資訊(工作證明)
$ show proof request Loan-Application-KYC				  // 顯示貸款KYC需求
$ send proof Loan-Application-KYC to Thrift Bank 	// 提交KYC需求
```