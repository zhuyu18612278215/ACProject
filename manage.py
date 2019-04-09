#!/usr/bin/env python
import os
import sys
sys.path.append("DataQuery")
import DataQuery

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DevCloud.settings")

    from django.core.management import execute_from_command_line

    DataQuery.LOGGING_INIT()
    # DataQuery.LOGGING_STR("INFO", "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")

    execute_from_command_line(sys.argv)
