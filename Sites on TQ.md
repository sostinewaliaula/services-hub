docker ps -a --format '{{.Names}}'

Host 121
    VM 130 (Docker_Weblogic_Server)
        cadvisor
        Weblogic_donewell 8005 ==> No deployments.
        madison_8009
        Weblogic_Kenindia_9005
        weblogic_9001_nigerstg
        weblogic_8002_fidelity_gis
        weblogic_9002_lifecostg
            http://10.176.18.130:9002/FMS/ ==> TQ FMS
            http://10.176.18.130:9002/LMSGroup ==> TQ LMS-GRP
            http://10.176.18.130:9002/LMSV4 ==> TQ LMS-ORD
            http://10.176.18.130:9002/SWICO-CRM ==> Swico CRM

    VM 101 (Alfresco)

    VM 139 (Database Server)
        cdb2 (1521) (12C)
            DEMO1
            GEMINIAPORTALS_TEST
            LIFECO_INT
            DEMO2
            APALIFE_TEST
            HERITAGE_PORTALS
            FMS4V6
        orcl
            CRMDEMO

            sqlplus system/oracle@10.176.18.139:1521/cdb2

Host 50
    VM 70 (Docker_Weblogic_Server)
        PORTALSABSA ==> Oracle DB 12C
        swico-server ==> Oracle DB 12C
        devs-server ==> Oracle DB 12C
        weblogic_8004
            http://10.176.18.70:8004/FMS/ ==> Custodian - custodianfms8004-dot70.turnkey.local
            http://10.176.18.70:8004/TQFMS/ ==> Custodian -  custodianfms28004-dot70.turnkey.local
        weblogic_7014_leadway
            http://10.176.18.70:7014/FMS ==> Swico FMS -  swicofms7014-dot70.turnkey.local
            http://10.176.18.70:7014/TQGIS ==> Leadway Assurance -  leadwaygis7014-dot70.turnkey.local
            http://10.176.18.70:7014/TQFMS ==> Swico Insurance -  swicofms27014-dot70.turnkey.local
        weblogic_fms_7005
            http://10.176.18.70:7005/BBKUG/ ==> ABSAUG Banca -  absauggis7005-dot70.turnkey.local
            http://10.176.18.70:7005/CRMCANNON ==> Cannon CRM -  cannoncrm7005-dot70.turnkey.local
            http://10.176.18.70:7005/CRMFID ==> Fidelity CRM -  fidelitycrm7005-dot70.turnkey.local
            http://10.176.18.70:7005/CRMMLIFE MLIFE CRM - mlifecrm7005-dot70.turnkey.local
            http://10.176.18.70:7005/FMS TQ FMS mlifetestfms7005-dot70.turnkey.local
            http://10.176.18.70:7005/LMSV4/ ==> TQ LMS-ORD - barclaysuglms7005-dot70.turnkey.local
            http://10.176.18.70:7005/TQFMS ==> MLIFE -  mlifefms7005-dot70.turnkey.local
            http://10.176.18.70:7005/LMSGroup ==> TQ LMS_GRP
            http://10.176.18.70:7005/TQGISTEST/ ==> TQ GIS
            http://10.176.18.70:7005/SWICO-CRM ==> SWICO-CRM swicocrmdot70.turnkey.local
        weblogic_7010
            http://10.176.18.70:7010/FMS/ ==> TQ FMS
        weblogic_geminia_7006
            Console/Management requests or requests with <require-admin-traffic> specified to 'true' can only be made through an administration channel
        weblogic_fms_6059
            http://10.176.18.70:6059/BBZAMBIA ==> ABSA Zambia absazadot70.turnkey.local        absazagis6059-dot70.turnkey.local
            http://10.176.18.70:6059/CRM-HERITAGE ==> Heritage CRM - heritagecrmdot70.turnkey.local heritagecrm6059-dot70.turnkey.local
            http://10.176.18.70:6059/CRMBBZ ==> ABSAUG CRM - absaugcrmdot70.turnkey.local absaugcrm6059-dot70.turnkey.local<site><application><port><host><domain>
            http://10.176.18.70:6059/FMS ==> TQ FMS heritagefms6059-dot70.turnkey.local
            http://10.176.18.70:6059/TQFMS/ ==> TQ FMS2  heritagefms26059-dot70.turnkey.local
            http://10.176.18.70:6059/GISPROD ==> TQ GIS
            http://10.176.18.70:6059/TQCRMTST ==> Heritage CRM Test - heritagecrmtstdot70.turnkey.local
            http://10.176.18.70:6059/TQGIS ==> Heritage GIS heritagegis6059-dot70.turnkey.local
        weblogic_ABSAKE_7011
            http://10.176.18.70:7011/FMS ==> TQ FMS
        weblogic_eaul_6015
            http://10.176.18.70:6015/FMS ==> TQ FMS
        weblogic_fmw
        InfraDB
        weblogig_8008_fms
        weblogig_8007_bbk
        weblogic_8005_fms
    
    VM 75 (Docker_Weblogic_Server)
        cadvisor
        DEBEZIUM ==> Oracle DB 
        BRITAM_UG ==> Oracle DB
        EMMANUEL_DEV ==> Oracle DB
        FELIX_DEV ==> Oracle DB

        weblogic_mnrch_6048
            http://10.176.18.75:6048/FMSLIVE/  #This site can’t be reached
        weblogic_8002
        weblogic_8006
        weblogic_8003
        weblogic_QA_brokerage_8001
        weblogic__8007
        weblogic_cannon_9002
        weblogic_8010
        weblogic_8005
        weblogic_test_7002

    VM 26 (Jenkins_Server) http://10.176.18.26:8080/  jenkins.turnkey.local

    VM 41 (LMS_DATABASE)
        Currently offline
    VM 57 (Database Server)
        orcl (1521)
            CUSTODIAN
            SWICO

        cdb2 (1522)
            STARLFE_19C
            NATIONALDB
    VM 52 (Database Server)
        cbd1 (1521)
            KQPDB
            CANNON19C
            LIBERTY_19C
            SMILELIFEPDB 
            LIFECOTEST
            ALLIANZ
        
    VM 35 (Weblogic Server)

        wlsFMSCRM7008
            http://10.176.18.35:7008/FMS ==> Heritage FMS -  heritagefms7008-dot35.turnkey.local
            http://10.176.18.35:7008/TQFMS/ ==> Heritage FMS2 -  heritagefms27008-dot35.turnkey.local
            http://10.176.18.35:7008/GEMINIA_LMS12C-GRP/ ==> Geminia Life Insurance - geminialmsdot35.turnkey.local geminialms7008-dot35.turnkey.local
            http://10.176.18.35:7008/HRMS/ ==> Geminia Insurance - geminiahrms7008-dot35.turnkey.local
            http://10.176.18.35:7008/HRMS_SS/ ==> Geminia (Employee Self Service)
            http://10.176.18.35:7008/LMSV4 ==> Geminia Life LMS ORD

        wlsGEMDOMAIN8001
            http://10.176.18.35:8001/CRM-ALLIANZ/ ==> Allianz CRM - allianzcrm8001-dot35.turnkey.local
            http://10.176.18.35:8001/HRMS ==> Geminia Insurance newgemianiahrms8001-dot35.turnkey.local
            http://10.176.18.35:8001/HRMS_SS Geminia (Employee Self Service)
            http://10.176.18.35:8001/GEMINIACRM ==> Geminia Insurance - geminiacrm8001-dot35.turnkey.local
            http://10.176.18.35:8001/LMSV4 ==> Allianz LMS ORD allianzlms8001-dot35.turnkey.local
            http://10.176.18.35:8001/LMS-ALLIANZ-GRP ==> Sanlam|Allianz Group Life - allianzlmsgrp8001-dot35.turnkey.local
            http://10.176.18.35:8001/TQGIS ==> Geminia GIS - geminiagis8001-dot35.turnkey.local

        wlsAIICODOMAIN6001
            http://10.176.18.35:6001/LMS_AIICO_IND-INDV4/ ==> AIICO Insurance ORD - aiicolmsind6001-dot35.turnkey.local
            http://10.176.18.35:6001/AIICO-LMS-GRP ==> AIICO Insurance GRP #seek name aiicolmsgrp6001-dot35.turnkey.local
            http://10.176.18.35:6001/FMS ==> AIICO FMS - aicofms6001-dot35.turnkey.local
            http://10.176.18.35:6001/GIS-AICCO/ ==> AIICO GIS - aiicogis6001-dot35.turnkey.local
            http://10.176.18.35:6001/LMSV4/ ==> LMS ORD #not accessible - errors
            http://10.176.18.35:6001/LMS-ALLIANZ-GRP ==> AIICO GRP - allianzlmsgrp6001-dot35.turnkey.local
            http://10.176.18.35:6001/LMS_AIICO_IND-LMSV4 ==> AIICO LMS-IND - aiicolms6001-dot35.turnkey.local

        wlsMUTUALDOMAIN8006
            http://10.176.18.35:8006/TQFMS/ => (MUTUAL-OFFICE-FMS2) #loop loading mutualfms28006-dot35.turnkey.local
            http://10.176.18.35:8006/MUTUAL-LMS-OFFICE-GRP/ ==> MUTUAL-OFFICE-GRP - mutuallmsgrp8006-dot35.turnkey.local
            http://10.176.18.35:8006/FMS/ ==> Tunquest FMS - mutualfms8006-dot35.turnkey.local
            http://10.176.18.35:8006/LMSV4 ==> TQ-LMS-ORD  - mutuallms8006-dot35.turnkey.local
            http://10.176.18.35:8006/LIFECO_CRM12C ==> Lifeco CRM lifecocrm8006-dot35.turnkey.local
            http://10.176.18.35:8006/TQGIS ==> Zenith GIS - zenithgis8006-dot35.turnkey.local

        wlsLIFECODOMAIN2001
            http://10.176.18.35:2001/GALIFE12C-LMS-GRP/ (GA-Life) DB=10.176.18.46:1522/GA21C - galifelms2001-dot35.turnkey.local
            http://10.176.18.35:7001/FMS ==> APA General FMS - apafms7001-dot35.turnkey.local
            http://10.176.18.35:2001/KCB-12c ==> KCB
            http://10.176.18.35:2001/LMSV4/ LMS-ORD - ga21clms2001-dot35.turnkey.local
            http://10.176.18.35:2001/LMS-ALLIANZ-GRP ==> GA Life LMS-GRP - galifelms2001-dot35.turnkey.local
            http://10.176.18.35:2001/NBK-12c ==> NBK Banca - nationalgis2001-dot35.turnkey.local

        
    VM 14 (Jira) http://10.176.18.14:8080/ jira.turnkey.local 
    VM 24 (Database 19C)
        cdb1 (1522)
            PRUDENTIALPDB
    VM 10 (Databse Server 12c)
        cdb1 (1521)
            CANNON_TEST
            EVOLVE_TEST
    VM 222 (BI Server)
    VM 55 (Jenkins) jenkins.turnkey.local
    VM 73 (v6_api_server221)


Host 120
    VM 90 (19C) (1521) (Database Server)
        KCB
        BANCADEV
    
    VM 91 (Database Server)
        orcl
            HERITAGEINT
            HERITAGE19C
        cdb1
            MLIFETEST
        
    VM 93 (jiratestdr93) jiratest.turnkey.local
    
    VM 95 (Database Server)
        cdb1 (12C) (1521)
            BRITAMRW
            LEADWAY_TEMP

        orcl (12C) (12C)
            MUTUAL
            STAR_DISCOVERY
            GLICO_TEST
    VM 97 (Weblogic Server)
        wlsFMSCRM7001
            http://10.176.18.97:7001/APALIFE-LMS-GRP ==> APALIFE-LMS-GRP apalifelmsgrp7001-dot97.turnkey.local
            http://10.176.18.97:7001/ABSA-K/ ==> TQ Banca 
            http://10.176.18.97:7001/FMS ==> Liberty FMS libertyfms7001-dot97.turnkey.local
            http://10.176.18.97:7001/TQFMS/ ==> Liberty FMS2 libertyfms27001-dot97.turnkey.local
            http://10.176.18.97:7001/LMSV4 ==> APA Life LMS-ORD apalifelms7001-dot97.turnkey.local

        wlsBASEDOMAIN80005
            http://10.176.18.97:8005/CRM-HERITAGE12C ==> Heritage CRM - heritagecrm8005-dot97.turnkey.local
            http://10.176.18.97:8005/BROKERAGE/ ==> TQ GIS
            http://10.176.18.97:8005/CRM-GEMINIA12C ==> TQ CRM
            http://10.176.18.97:8005/GIS-ALLIANZ ==> Allianz GIS - allianzgis8005-dot97.turnkey.local
            http://10.176.18.97:8005/FMS ==> Allianz FMS - allianzfms8005-dot97.turnkey.local
            http://10.176.18.97:8005/TQFMS/ ==> Allianz FMS2 - allianzfms28005-dot97.turnkey.local
            http://10.176.18.97:8005/KCB-12c ==> TQ Claims Mgt System
            http://10.176.18.97:8005/KCB-CRM ==> TQ CRM - kcbcrm8005-dot97.turnkey.local
            http://10.176.18.97:8005/LMSV4 ==> TQ-LMS-ORD
            http://10.176.18.97:8005/LMS-AIICO-IND-INDV4 == TQ LMS-ORD - aiicolms8005-dot97.turnkey.local
            http://10.176.18.97:8005/LMS-ALLIANZ-GRP ==> TQ GRP - allianzlmsgrp8005-dot97.turnkey.local
            http://10.176.18.97:8005/LMS_AIICO-INDV4  ==> AIICO LMS-ORD - aiicolms8005-dot97.turnkey.local
            http://10.176.18.97:8005/GISTQUEST/ ==> Heritage GIS - heritagegis8005-dot97.turnkey.local

######################################## To be continued. ########################

        wlsSMILELIFE9001
        http://10.176.18.97:9001/FMS  ==> Smile life FMS DB=10.176.18.52:1521/SMILELIFEPDB
        http://10.176.18.97:9001/CRM-SMILELIFE ==> Smile Life CRM
        http://10.176.18.97:9001/LMSV4 Smile LMS-ORD
        http://10.176.18.97:9001/SMILELIFE-LMS-GRP ==> Smile LMS-GRP
    VM 98 (Weblogic Server)
       wlsV6_9001
        http://10.176.18.98:9001/CRM-MUTUAL ==> Mutual CRM mutualcrmdot98.turnkey.local
        http://10.176.18.98:9001/FMS ==> TQ FMS nbkfmsdot98.turnkey.local
        http://10.176.18.98:9001/GIS-AICCO ==> AIICO GIS aiicogisdot98.turnkey.local
        http://10.176.18.98:9001/LMSV4 ==> Mutual LMS-ORD mutuallmsdot98.turnkey.local
        http://10.176.18.98:9001/LMSGroup ==> Star Discover LMS-GRP stardiscoverlmsdot98.turnkey.local
        http://10.176.18.98:9001/TQGIS ==> Mutual GIS mutualgisdot98.turnkey.local
       wlsbasedomain8002
        https://10.176.18.98:8002/TQGIS ==> (MUTUAL-GIS-OFFICE) DB=10.176.18.95:1521/MUTUAL
        http://10.176.18.98:8002/FMS ==> Zenith FMS - zenithfms8002-dot98.turnkey.local
        http://10.176.18.98:8002/TQFMS ==> Zenith FMS2 - zenithfms28002-dot98.turnkey.local
        http://10.176.18.98:8002/GIFTCRM ==> GIFT CRM 
        http://10.176.18.98:8002/KCB-12c ==> KCB-12c
        http://10.176.18.98:8002/TQCRMKCB ==> TQ CRM KCB
        http://10.176.18.98:8002/ZENITH-CRM-12C ==> Zenith CRM

    VM 99 (Database Server)
        cdb1 (12C) (1522)
            BBKPDB1
            EAGLE
            COMMIT_DB
            TEST
            GNLIFE
            FMSV45
            SWICO

    VM 110 (Database Server)
        cdb2 (19C) (1521)
            NEW_GEMINIA
            HERITAGEDEV
        orcl (12C) (1522)
            - No pdbs
        
        DB19C (19c) ()
    VM 103 (Docker_Weblogic_Server)
        cadvisor
        weblogic_8098
        life_co_8099
            http://10.176.18.103:8099/LMSGroup  - lifecolmsgrp8099-dot103.turnkey.local
            http://10.176.18.103:8099/LMSV4 Lifeco LMS-ORD ==> DB=10.176.18.139:1521/LIFECO_INT - lifecolms8099-dot103.turnkey.local
        weblogic_niger_7015
        weblogic_6058
        weblogic_mnrch_6048
        weblogic_6059
        weblogic_6053
        weblogic_6056
        weblogic_pacis_6075
        weblogic_donewell_8098
    
    VM 105 (turnkeyapis) turnkeyapi.turnkey.local

    VM 69 (VPN Server) vpn.turnkey.local

    VM 143 (Zimbra Server) zimbra.turnkey.local

Host 22
    VM 29 (Database Server) (11g)
        madisonk (1521)
            madisonk
        MADISON
            MADISON
        AIICO
            AIICO

    VM 23 (Testers Link)

    VM 46 (Database Server)
        GA (21C) (1522)
            GA21C
        orcl (19C) (1521)
            ZENITH_STG
            LIBERTY
            GISDEV
            ABSAUG19C
    VM 140 (Weblogic_Servers)
        wlsBanca7001 
            http://10.176.18.140:7001/TQGIS ==> APA Insurance apagis7001-dot140.turnkey.local
            http://10.176.18.140:7001/CRM-STARDISCOVERY ==> Star Discover CRM - stardiscoverycrm7001-dot140.turnkey.local
            http://10.176.18.140:7001/FMS ==> Star Discover FMS - stardiscoveryfms7001-dot140.turnkey.local
            http://10.176.18.140:7001/TQFMS ==> Star Discover FMS2 - stardiscoveryfms27001-dot140.turnkey.local
            http://10.176.18.140:7001/LMSV4 ==> Star Life LMS-ORD - startlifefms7001-dot140.turnkey.local

        wlsABSAUG4001
            http://10.176.18.140:4001/FMS DB=10.176.18.46:1521/ABSAUG19C
            http://10.176.18.140:4001/BANCA ==> 503 Error
            http://10.176.18.140:4001/CRM-ABSAUG12C ==> ABSAUG CRM
            http://10.176.18.140:4001/CRM-MUTUAL ==> MUTUAL CRM
            http://10.176.18.140:4001/GALIFE12C-CRM ==> GA Life CRM
            http://10.176.18.140:4001/GIS-ABSAUG12C ==> ABSAUG GIS
            http://10.176.18.140:4001/LMSV4 TQ LMS-ORD
            http://10.176.18.140:4001/TQGIS ==> TQ GIS
            http://10.176.18.140:4001/LMSV41 ==> TQ LMS-ORD

        wlsImara8001
            http://10.176.18.140:8001/CRM-SHAKB/ ==> MUTUAL-CRM
            http://10.176.18.140:8001/FMS ==> TQ FMS
            http://10.176.18.140:8001/GALIFE12C-CRM ==> GA Life CRM
            http://10.176.18.140:8001/LMSV4 ==> MUTUAL-LMS-ORD
            http://10.176.18.140:8001/SHAK/ ==> TQ-GIS
            http://10.176.18.140:8001/STARLIFE12C-CRM ==> Star Life CRM

        wlsAPA9001
            http://10.176.18.140:9001/APA12C-CRM ==> APA CRM apacrm9001-dot140.turnkey.local
            http://10.176.18.140:9001/APALIFE12C-CRM ==> APA CRM - apollov45crm9001-dot140.turnkey.local
            http://10.176.18.140:9001/CRM-Hannah ==> TQ CRM HANNAH - demo1crm9001-dot140.turnkey.local
            http://10.176.18.140:9001/FMS ==> TQ FMS - apalifetestfms9001-dot140.turnkey.local
            http://10.176.18.140:9001/TQFMS ==> TQ FMS2
            http://10.176.18.140:9001/TQGIS_HANNAH ==> TQ GIS - demo1gis9001-dot140.turnkey.local

        wlsKQ2001
            http://10.176.18.140:2001/CRM-AIICO ==> CRM-AIICO -  aiicocrm2001-dot140.turnkey.local
            http://10.176.18.140:2001/FMS ==> TQ FMS - startlifefms2001-dot140.turnkey.local
            http://10.176.18.140:2001/TQFMS/ TQ FMS2 - startlifefms22001-dot140.turnkey.local
            http://10.176.18.140:2001/KQ-CMS ==> KQ Claims Mgt Sys 
            http://10.176.18.140:2001/KQ-CRM ==> KQ CRM - kqcrm2001-dot140.turnkey.local
            http://10.176.18.140:2001/KQ-GIS ==> KQ GIS
            http://10.176.18.140:2001/LMS ==> Prudential LMS-ORD -  prudentiallms2001-dot140.turnkey.local
            http://10.176.18.140:2001/TQGIS ==> StarDiscover GIS stardiscovergis2001-dot140.turnkey.local

        wlsLIBERTY5001
            http://10.176.18.140:5001/FMS ==> APA FMS - cannonfms5001-dot140.turnkey.local
            http://10.176.18.140:5001/TQCRM ==> Liberty CRM - libertycrm5001-dot140.turnkey.local
            http://10.176.18.140:5001/TQGIS ==> Liberty GIS - libertygis5001-dot140.turnkey.local

        wlsMUTUAL6001
            http://10.176.18.140:6001/FMS ==> MUTUAL-FMS - galifefms6001-dot140.turnkey.local
            http://10.176.18.140:6001/TQFMS ==> GA Life FMS2 - galifefms26001-dot140.turnkey.local
            http://10.176.18.140:6001/LIFECO_LMS12C-GRP ==> Lifeco LMS-GRP - lifecolms6001-dot140.turnkey.local
            http://10.176.18.140:6001/LMSV4 ==> Smile Life LMS-ORD - lifecotestlms6001-dot140.turnkey.local
    VM 36 (weblogic 11g)
        wls8005
            http://10.176.18.36:8005/BBKUG/ ==> TQ Banca - absauggis8005-dot36.turnkey.local
            http://10.176.18.36:8005/CANNONFMS ==> Cannon FMS - cannonfms8005-dot36.turnkey.local
            http://10.176.18.36:8005/HRMSGEM ==> Geminia HRMS - cannonhrms8005-dot36.turnkey.local
        
        wls9111
            http://10.176.18.36:9111/CRMFID ==> Fidelity CRM - fidelitycrm9111-dot36.turnkey.local
            http://10.176.18.36:9111/CRMMLIFE ==> LifeCo CRM - lifecocrm9111-dot36.turnkey.local
            http://10.176.18.36:9111/CUSTDIAN-CRM ==> Custodian CRM - custodiancrm9111-dot36.turnkey.local
            http://10.176.18.36:9111/GIS-CANNON ==> Cannon GIS - cannongis9111-dot36.turnkey.local
            http://10.176.18.36:9111/GIS-LIVE ==> Professional GIS - professionalgis9111-dot36.turnkey.local
            http://10.176.18.36:9111/GISLIVE ==> Professional GIS
            http://10.176.18.36:9111/GISSWICO ==> Swico GIS - swicogis9111-dot36.turnkey.local
            http://10.176.18.36:9111/GISTEST1 ==> TQ GIS - fidelitygis9111-dot36.turnkey.local
            http://10.176.18.36:9111/MADISON_CRM ==> TQ CRM - madisoncrm9111-dot36.turnkey.local
        wls9090
            http://10.176.18.36:9090/LMSCUSTODIAN ==> Custodian LMS-ORD - custodianlms9090-dot36.turnkey.local
            http://10.176.18.36:9090/LMSGroup ==> Custodian LMS-GRP - custodianlmsgrp9090-dot36.turnkey.local




Host 3 (Host Currently Down)
    VM 38
        jenkins38
    VM 34
        portals34


Host 13 (Docker Database server)
    TQDB1 - Listener Port: 1600, OEM Port: 1601  
    TQDB2 - Listener Port: 1700, OEM Port: 1701  
    TQDB3 - Listener Port: 1800, OEM Port: 1801  
    TQDB5 - Listener Port: 1630, OEM Port: 1631  
    TQDBNBK - Listener Port: 1818, OEM Port: 1819  
    TQEVEVOLVE - Listener Port: 1650, OEM Port: 1651  
    TESTGEMINIA - Listener Port: 1544, OEM Port: 18035  
    APALIFE_TEST - Listener Port: 1545, OEM Port: 18036  

    Stopped containers:  
    TQEVOLVE  
    EVOLVE

Host 60 ==> Backup Share
Host 73 ==> Portals







Desktop Hosts;
    Host 27 ==> Gerrit
    Host 138 ==> Database server (19c)
        cdb1 (1522)
            FIDINT
            PRUDENTIAL
            FIDTEST
    Host 149 ==> Database server (19c)
        KCB (1521)
            AIICO
    Host 15 (Database Server 19C)
        cdb1 (1522)
            PICZ_TEMP
            BRITAM_UG
            DONEWELL
        cdb2 (1521)
            INSURANCEDEV
    Host 12 (Database Server 21c)
        cdb2 (1521)
            APATEST
            GA21C_TEMP