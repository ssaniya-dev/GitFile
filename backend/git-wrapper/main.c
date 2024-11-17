#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <zlib.h>

typedef struct {
    char* filename;
    size_t file_size;
    unsigned char* buffer;
    size_t bytes_decompressed;
    unsigned char* decompressed_data;
} ParsedData;

void parse_decompressed_data(ParsedData* data) {
    for (size_t i = 0; i < data->bytes_decompressed; i++) {
        printf("%c", data->decompressed_data[i]);
    }

    for (size_t i = 0; i < data->bytes_decompressed; i++) {
        printf("%02x ", data->decompressed_data[i]);
    }

    for (size_t i = 0; i < data->bytes_decompressed; i++) {
        for (int j = 7; j >= 0; j--) {
            printf("%d", (data->decompressed_data[i] >> j) & 1);
        }
        printf(" ");
    }
    printf("\n");
}

void run_script(const char* filename) {
    FILE* file = fopen(filename, "rb");
    if (!file) {
        return;
    }

    // file into buffer
    fseek(file, 0, SEEK_END);
    size_t file_size = ftell(file);
    rewind(file);
    unsigned char* buffer = malloc(file_size);
    fread(buffer, file_size, 1, file);
    fclose(file);

    z_stream strm;
    strm.zalloc = Z_NULL;
    strm.zfree = Z_NULL;
    strm.opaque = Z_NULL;
    inflateInit2(&strm, -15); // -15 for raw inflate (change this to -30?? - royce)

    strm.avail_in = file_size;
    strm.next_in = buffer;
    unsigned char out[1024];
    strm.avail_out = sizeof(out);
    strm.next_out = out;

    int ret;
    size_t bytes_decompressed = 0;
    unsigned char* decompressed_data = malloc(file_size * 2);
    do {
        ret = inflate(&strm, Z_NO_FLUSH);
        if (ret == Z_STREAM_ERROR) {
            break;
        }
        size_t bytes_decompressed_in_loop = sizeof(out) - strm.avail_out;
        memcpy(decompressed_data + bytes_decompressed, out, bytes_decompressed_in_loop);
        bytes_decompressed += bytes_decompressed_in_loop;

        strm.avail_out = sizeof(out);
        strm.next_out = out;
    } while (strm.avail_out == 0);
    inflateEnd(&strm);

    ParsedData data;
    data.filename = strdup(filename);
    data.file_size = file_size;
    data.buffer = buffer;
    data.bytes_decompressed = bytes_decompressed;
    data.decompressed_data = decompressed_data;

    parse_decompressed_data(&data);
    free(buffer);
    free(decompressed_data);
    free(data.filename);
}


int main() {
    git_repository *repo;
    int error;

    error = git_repository_open(&repo, ".");
    if (error < 0) {
        const git_error *e = giterr_last();
        return error;
    }

    git_config *config;
    error = git_config_open_ondisk(&config, repo);
    if (error < 0) {
        const git_error *e = giterr_last();
        return error;
    }
    git_config_set_string(config, "core.addwrapper", "my_git_add_wrapper");

    error = git_add_wrapper(repo, file_path);
    if (error < 0) {
        return error;
    }

    git_config_free(config);
    git_repository_free(repo);
    return 0;
}