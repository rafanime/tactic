from multiprocessing import Process
from SocketServer import TCPServer, BaseRequestHandler as TCPHandler
from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler as HTTPHandler

policy = """<?xml version="1.0"?>
<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">
<cross-domain-policy>
	<site-control permitted-cross-domain-policies="master-only"/>
	<allow-access-from domain="*" to-ports="61613,5672" />
</cross-domain-policy>
"""

class PolicyHandler(TCPHandler):
    def handle(self):
        data = self.request.recv(1024).strip()
        print 'Got request: ' + data
        if '<policy-file-request/>' in data:
            self.request.sendall(policy)

def handle_policy():
    print 'Serving policy on port 843'
    TCPServer(('', 843), PolicyHandler).serve_forever()
    
def handle_files():
    print 'Serving files on port 8000'
    HTTPServer(('', 8000), HTTPHandler).serve_forever()
    
if __name__=='__main__':
    Process(target=handle_policy).start()
    Process(target=handle_files).start()