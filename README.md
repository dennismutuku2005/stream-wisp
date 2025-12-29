# Stream-Mikrotik

## Overview
A monitoring tool for MikroTik networks that tracks access point status and DHCP server health in real-time.

## Features

### 🔍 Monitoring Capabilities
- **Access Point Status** – Detect when APs go offline/online
- **DHCP Server Health** – Monitor lease distribution and pool usage
- **Wireless Client Tracking** – Track connected clients per AP

### 📊 Reporting
- **Real-time Alerts** – Instant notifications for status changes
- **Historical Reports** – Uptime and availability history
- **Performance Metrics** – Signal strength and connection quality

### 🚨 Alerting
- **Multiple Channels** – Email, Webhook, SMS, Slack
- **Configurable Thresholds** – Custom alert conditions
- **Escalation Rules** – Multi-level alerting for critical issues

## Use Cases

### 🏢 Enterprise Networks
- Monitor campus-wide wireless coverage
- Track AP failures across multiple buildings
- Ensure DHCP availability for critical services

### 🏨 Hospitality & Retail
- Maintain guest WiFi reliability
- Monitor high-density AP deployments
- Track seasonal usage patterns

### 🏠 Managed Service Providers
- Centralized monitoring for client networks
- Automated ticket creation for outages
- SLA compliance reporting

## Outputs

### Dashboard
- Web-based status dashboard
- Geographic AP location view
- Real-time connection graphs

### Reports
- Daily/Weekly/Monthly summaries
- Uptime percentage reports
- Incident history logs

### Integrations
- REST API for external systems
- Webhook support for automation
- Export to CSV/JSON formats

## Architecture

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│ MikroTik    │    │ Stream-      │    │ Notification │
│ Devices     │───▶│ MikroTik     │───▶│ Channels     │
│ (APs/Routers)│    │ Monitor      │    │              │
└─────────────┘    └──────────────┘    └──────────────┘
                           │                    │
                    ┌──────────────┐    ┌──────────────┐
                    │ Data Storage │    │ Web Dashboard│
                    │ & Reporting  │    │ & API        │
                    └──────────────┘    └──────────────┘
```

## Alert Types

### Access Point Alerts
- **AP Offline** – Access point unreachable
- **High Client Count** – AP approaching capacity
- **Poor Signal Quality** – Coverage issues detected
- **Configuration Mismatch** – Settings inconsistency

### DHCP Alerts
- **Pool Exhaustion** – DHCP addresses running low
- **Server Unreachable** – DHCP service down
- **Lease Time Issues** – Abnormal lease distribution
- **Rogue DHCP Detected** – Unauthorized DHCP server

## Benefits

### 📈 Improved Visibility
- Centralized view of all MikroTik devices
- Historical trend analysis
- Geographic status mapping

### ⏱️ Reduced Downtime
- Proactive issue detection
- Faster troubleshooting
- Automated alert escalation

### 📋 Compliance & Reporting
- SLA compliance tracking
- Audit trail for incidents
- Performance benchmarking

## Getting Started

### Prerequisites
- MikroTik RouterOS devices
- Network access to monitored devices
- Appropriate authentication credentials

### Basic Setup
1. Configure device access credentials
2. Define monitoring intervals
3. Set up notification channels
4. Configure alert thresholds
5. Deploy monitoring agents

## Support

### Supported MikroTik Devices
- RouterBOARD wireless models
- CAPsMAN controllers
- Switch models with wireless
- All RouterOS versions with API access

### Monitoring Methods
- RouterOS API
- SSH connectivity
- SNMP polling
- ICMP ping checks

---

*Note: This tool is designed for network administrators and requires appropriate permissions for all monitored devices.*