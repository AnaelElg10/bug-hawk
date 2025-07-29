#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { config } from 'dotenv';
import { AuthCommand } from './commands/auth.command';
import { IssueCommand } from './commands/issue.command';
import { ProjectCommand } from './commands/project.command';
import { ConfigCommand } from './commands/config.command';
import { DashboardCommand } from './commands/dashboard.command';

// Load environment variables
config();

const program = new Command();

// ASCII Art Banner
function displayBanner() {
  console.log(
    chalk.cyan(
      figlet.textSync('BugHawk CLI', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );
  console.log(chalk.gray('Enterprise Bug Tracking CLI Tool\n'));
}

// Main CLI setup
async function main() {
  displayBanner();

  program
    .name('bughawk')
    .description('BugHawk CLI - Enterprise Bug Tracking Platform')
    .version('1.0.0')
    .option('-v, --verbose', 'Enable verbose logging')
    .option('--api-url <url>', 'Override API URL')
    .hook('preAction', (thisCommand) => {
      const options = thisCommand.opts();
      if (options.verbose) {
        process.env.VERBOSE = 'true';
      }
      if (options.apiUrl) {
        process.env.BUGHAWK_API_URL = options.apiUrl;
      }
    });

  // Authentication commands
  const authCommand = new AuthCommand();
  program
    .command('auth')
    .description('Authentication commands')
    .addCommand(authCommand.loginCommand())
    .addCommand(authCommand.logoutCommand())
    .addCommand(authCommand.statusCommand())
    .addCommand(authCommand.switchCommand());

  // Issue management commands
  const issueCommand = new IssueCommand();
  program
    .command('issue')
    .alias('issues')
    .description('Issue management commands')
    .addCommand(issueCommand.createCommand())
    .addCommand(issueCommand.listCommand())
    .addCommand(issueCommand.showCommand())
    .addCommand(issueCommand.updateCommand())
    .addCommand(issueCommand.commentCommand())
    .addCommand(issueCommand.assignCommand())
    .addCommand(issueCommand.closeCommand())
    .addCommand(issueCommand.searchCommand());

  // Quick report command (shortcut)
  program
    .command('report')
    .description('Quick bug report (interactive)')
    .option('-p, --project <project>', 'Project key or ID')
    .option('-t, --title <title>', 'Issue title')
    .option('-d, --description <description>', 'Issue description')
    .option('--priority <priority>', 'Priority (low, medium, high, critical, blocker)')
    .option('--severity <severity>', 'Severity (trivial, minor, major, critical, blocker)')
    .option('--attach <files...>', 'Attach files')
    .action(async (options) => {
      await issueCommand.quickReport(options);
    });

  // Project management commands
  const projectCommand = new ProjectCommand();
  program
    .command('project')
    .alias('projects')
    .description('Project management commands')
    .addCommand(projectCommand.listCommand())
    .addCommand(projectCommand.showCommand())
    .addCommand(projectCommand.createCommand())
    .addCommand(projectCommand.membersCommand())
    .addCommand(projectCommand.switchCommand());

  // Configuration commands
  const configCommand = new ConfigCommand();
  program
    .command('config')
    .description('Configuration management')
    .addCommand(configCommand.getCommand())
    .addCommand(configCommand.setCommand())
    .addCommand(configCommand.listCommand())
    .addCommand(configCommand.resetCommand());

  // Dashboard commands
  const dashboardCommand = new DashboardCommand();
  program
    .command('dashboard')
    .alias('dash')
    .description('View dashboard and statistics')
    .option('-p, --project <project>', 'Filter by project')
    .option('--assigned', 'Show only issues assigned to you')
    .option('--reported', 'Show only issues reported by you')
    .action(async (options) => {
      await dashboardCommand.show(options);
    });

  // Utility commands
  program
    .command('init')
    .description('Initialize BugHawk configuration for current project')
    .option('--project <project>', 'Project key to associate with this directory')
    .action(async (options) => {
      await configCommand.init(options);
    });

  program
    .command('status')
    .description('Show current status and configuration')
    .action(async () => {
      await authCommand.showStatus();
      await configCommand.showCurrent();
    });

  // Webhook commands for CI/CD integration
  program
    .command('webhook')
    .description('Create issue from webhook data (for CI/CD integration)')
    .option('--git-commit <commit>', 'Git commit hash')
    .option('--git-branch <branch>', 'Git branch name')
    .option('--git-repo <repo>', 'Git repository URL')
    .option('--pipeline-url <url>', 'CI/CD pipeline URL')
    .option('--error-log <file>', 'Path to error log file')
    .action(async (options) => {
      await issueCommand.createFromWebhook(options);
    });

  // Bulk operations
  program
    .command('bulk')
    .description('Bulk operations on issues')
    .option('--import <file>', 'Import issues from CSV file')
    .option('--export <file>', 'Export issues to CSV file')
    .option('--project <project>', 'Project to operate on')
    .action(async (options) => {
      await issueCommand.bulkOperations(options);
    });

  // Error handling
  program.exitOverride();

  try {
    await program.parseAsync(process.argv);
  } catch (error: any) {
    if (error.code === 'commander.helpDisplayed') {
      return;
    }
    
    console.error(chalk.red('Error:'), error.message);
    
    if (process.env.VERBOSE === 'true') {
      console.error(chalk.gray('\nStack trace:'));
      console.error(chalk.gray(error.stack));
    }
    
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught Exception:'), error.message);
  if (process.env.VERBOSE === 'true') {
    console.error(chalk.gray(error.stack));
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise, 'reason:', reason);
  process.exit(1);
});

// Entry point
if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('Failed to start CLI:'), error.message);
    process.exit(1);
  });
}